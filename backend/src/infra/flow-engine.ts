import type {
  Flow,
  FlowNode,
  NodeConfig,
  TriggerConfig,
  MessageConfig,
  QuestionnaireConfig,
  ConditionConfig,
  HTTPConfig,
  UserContact,
  PolicyContext,
  Action,
} from '../../../shared/types.js';
import { ComplianceEngine } from '../compliance/engine.js';
import { ChannelAbstraction } from '../channels/abstraction.js';
import { AIService } from '../lib/ai.js';
import axios from 'axios';

export interface ExecutionContext {
  flowId: string;
  userId: string;
  user: UserContact;
  channelId: string;
  channelType: string;
  triggerData: any;
  variables: Record<string, any>;
  currentNodeId: string;
}

export interface ExecutionStep {
  nodeId: string;
  nodeType: string;
  timestamp: Date;
  action?: string;
  result?: any;
  error?: string;
}

export interface ExecutionResult {
  executionId: string;
  status: 'completed' | 'failed' | 'waiting_input' | 'skipped';
  steps: ExecutionStep[];
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  waitingFor?: {
    nodeId: string;
    questionId?: string;
    expectedInput?: string;
  };
}

export class FlowEngine {
  private compliance: ComplianceEngine;
  private channelAbstraction: ChannelAbstraction;
  private aiService: AIService;

  constructor() {
    this.compliance = new ComplianceEngine();
    this.channelAbstraction = new ChannelAbstraction();
    this.aiService = new AIService();
  }

  /**
   * Execute a flow from start to finish
   */
  async execute(
    flow: Flow,
    user: UserContact,
    channelId: string,
    channelType: string,
    triggerData: any
  ): Promise<ExecutionResult> {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const context: ExecutionContext = {
      flowId: flow.id,
      userId: user.id,
      user,
      channelId,
      channelType,
      triggerData,
      variables: {
        ...user.fields,
        name: user.name,
        handle: user.handle,
        email: user.email,
        phone: user.phone,
      },
      currentNodeId: '',
    };

    const result: ExecutionResult = {
      executionId,
      status: 'completed',
      steps: [],
      startedAt: new Date(),
    };

    try {
      // Find trigger node (entry point)
      const triggerNode = flow.nodes.find(n => n.type === 'trigger');
      if (!triggerNode) {
        throw new Error('No trigger node found in flow');
      }

      // Check if trigger matches
      if (!this.checkTrigger(triggerNode.config as TriggerConfig, triggerData, channelType)) {
        result.status = 'skipped';
        result.completedAt = new Date();
        return result;
      }

      // Start execution from first node after trigger
      const firstEdge = flow.edges.find(e => e.from === triggerNode.id);
      if (!firstEdge) {
        throw new Error('No edge found from trigger node');
      }

      context.currentNodeId = firstEdge.to;
      await this.executeNode(flow, context, result);

      result.status = 'completed';
      result.completedAt = new Date();

    } catch (error: any) {
      result.status = 'failed';
      result.error = error.message;
      result.completedAt = new Date();
    }

    return result;
  }

  /**
   * Execute a single node and progress to next
   */
  private async executeNode(
    flow: Flow,
    context: ExecutionContext,
    result: ExecutionResult
  ): Promise<void> {
    const node = flow.nodes.find(n => n.id === context.currentNodeId);
    if (!node) {
      return; // End of flow
    }

    const step: ExecutionStep = {
      nodeId: node.id,
      nodeType: node.type,
      timestamp: new Date(),
    };

    try {
      let nextNodeId: string | null = null;

      switch (node.type) {
        case 'message':
          nextNodeId = await this.executeMessageNode(node, context, step);
          break;

        case 'questionnaire':
          nextNodeId = await this.executeQuestionnaireNode(node, context, step, result);
          break;

        case 'condition':
          nextNodeId = await this.executeConditionNode(node, context, step);
          break;

        case 'http':
          nextNodeId = await this.executeHTTPNode(node, context, step);
          break;

        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }

      result.steps.push(step);

      // Continue to next node
      if (nextNodeId) {
        context.currentNodeId = nextNodeId;
        await this.executeNode(flow, context, result);
      } else if (result.status === 'waiting_input') {
        // Stop execution, waiting for user input
        return;
      }

    } catch (error: any) {
      step.error = error.message;
      result.steps.push(step);
      throw error;
    }
  }

  /**
   * MESSAGE NODE - Send message with compliance checks
   */
  private async executeMessageNode(
    node: FlowNode,
    context: ExecutionContext,
    step: ExecutionStep
  ): Promise<string | null> {
    const config = node.config as MessageConfig;
    
    // Replace variables in text
    let text = config.text || '';
    text = this.replaceVariables(text, context.variables);

    // Check compliance before sending
    const policyContext: PolicyContext = {
      channel: context.channelType as any,
      userId: context.userId,
      lastInboundAt: context.user.lastInAt,
      isFollower: context.user.isFollower,
    };

    const policyDecision = await this.compliance.checkPolicy(policyContext, 'message');

    if (!policyDecision.allowed) {
      // Handle fallback
      if (policyDecision.fallback === 'template') {
        step.action = 'fallback_to_template';
        step.result = { reason: policyDecision.reason };
        // In production, send WhatsApp template instead
      } else if (policyDecision.fallback === 'hold') {
        step.action = 'held';
        step.result = { reason: policyDecision.reason };
        return null;
      } else {
        throw new Error(`Policy violation: ${policyDecision.reason}`);
      }
    }

    // Use AI if configured
    if (config.aiConfig?.enabled) {
      const aiResult = await this.aiService.processMessage(
        text,
        config.aiConfig,
        context.variables
      );
      text = aiResult.text;
      step.result = { ...step.result, aiUsed: true };
    }

    // Send message through channel abstraction
    await this.channelAbstraction.sendMessage(
      context.channelType as any,
      context.channelId,
      context.userId,
      {
        text,
        buttons: config.buttons,
        quickReplies: config.quickReplies,
        media: config.media,
      }
    );

    step.action = 'message_sent';
    step.result = { text };

    // Handle button clicks (if any goTo defined)
    if (config.buttons && config.buttons.length > 0) {
      const buttonWithGoTo = config.buttons.find(b => b.goTo);
      if (buttonWithGoTo) {
        // In real implementation, wait for user to click
        // For now, continue to first button's goTo
        return buttonWithGoTo.goTo!;
      }
    }

    // Get next node
    return this.getNextNodeId(node.id, context);
  }

  /**
   * QUESTIONNAIRE NODE - Collect user input
   */
  private async executeQuestionnaireNode(
    node: FlowNode,
    context: ExecutionContext,
    step: ExecutionStep,
    result: ExecutionResult
  ): Promise<string | null> {
    const config = node.config as QuestionnaireConfig;

    // For prototype: simulate collecting answers
    // In production, this would pause and wait for real user input
    
    const answers: Record<string, any> = {};
    
    for (const question of config.questions) {
      // Send question
      const prompt = this.replaceVariables(question.prompt, context.variables);
      
      await this.channelAbstraction.sendMessage(
        context.channelType as any,
        context.channelId,
        context.userId,
        { text: prompt }
      );

      // Wait for answer (in prototype, we simulate)
      // In production: mark as waiting_input and resume later
      result.status = 'waiting_input';
      result.waitingFor = {
        nodeId: node.id,
        questionId: question.id,
        expectedInput: question.answerType,
      };

      // Simulate answer for demo
      let answer: any = null;
      
      // Validate answer
      if (question.validation) {
        // Apply validation logic
        // If validation fails and aiExtract enabled, use AI
        if (question.aiExtract) {
          answer = await this.aiService.extractField(
            answer || 'sample@email.com', // Simulated
            question.answerType
          );
        }
      }

      // Save answer to context and user fields
      answers[question.id] = answer;
      context.variables[question.saveTo] = answer;
    }

    step.action = 'questionnaire_completed';
    step.result = { answers };

    // Execute onComplete actions
    for (const action of config.onComplete) {
      await this.executeAction(action, context, answers);
    }

    // Continue to next node
    return this.getNextNodeId(node.id, context);
  }

  /**
   * CONDITION NODE - Branch based on conditions
   */
  private async executeConditionNode(
    node: FlowNode,
    context: ExecutionContext,
    step: ExecutionStep
  ): Promise<string | null> {
    const config = node.config as ConditionConfig;

    // Evaluate all conditions
    const results = await Promise.all(
      config.conditions.map(cond => this.evaluateCondition(cond, context))
    );

    // Apply operator (AND/OR)
    let finalResult: boolean;
    if (config.operator === 'AND') {
      finalResult = results.every(r => r);
    } else {
      finalResult = results.some(r => r);
    }

    step.action = 'condition_evaluated';
    step.result = { result: finalResult ? 'true' : 'false' };

    // Return appropriate branch
    return finalResult ? config.branches.true : config.branches.false;
  }

  /**
   * HTTP NODE - Make external API request
   */
  private async executeHTTPNode(
    node: FlowNode,
    context: ExecutionContext,
    step: ExecutionStep
  ): Promise<string | null> {
    const config = node.config as HTTPConfig;

    try {
      // Replace variables in URL and body
      const url = this.replaceVariables(config.url, context.variables);
      let body = config.body;
      
      if (typeof body === 'string') {
        body = this.replaceVariables(body, context.variables);
      }

      // Make request
      const response = await axios({
        method: config.method,
        url,
        headers: config.headers,
        data: body,
        timeout: config.timeout || 10000,
      });

      step.action = 'http_success';
      step.result = { status: response.status, data: response.data };

      // Map response fields to user fields
      if (config.responseMapping) {
        for (const [responseKey, userKey] of Object.entries(config.responseMapping)) {
          context.variables[userKey] = response.data[responseKey];
        }
      }

      // Execute onSuccess actions
      if (config.onSuccess) {
        for (const action of config.onSuccess) {
          await this.executeAction(action, context, response.data);
        }
      }

    } catch (error: any) {
      step.action = 'http_error';
      step.result = { error: error.message };

      // Execute onError actions
      if (config.onError) {
        for (const action of config.onError) {
          await this.executeAction(action, context, { error: error.message });
        }
      }

      throw error;
    }

    return this.getNextNodeId(node.id, context);
  }

  /**
   * Helper: Check if trigger matches
   */
  private checkTrigger(config: TriggerConfig, triggerData: any, channelType: string): boolean {
    if (config.channel && config.channel !== channelType) {
      return false;
    }

    switch (config.kind) {
      case 'comment_dm':
      case 'keyword':
        if (config.keyword && triggerData.message) {
          const matches = triggerData.message.toLowerCase().includes(config.keyword.toLowerCase());
          if (config.postIds && config.postIds.length > 0) {
            return matches && config.postIds.includes(triggerData.postId);
          }
          return matches;
        }
        return false;

      case 'dm':
        return triggerData.type === 'dm';

      case 'story_mention':
        return triggerData.type === 'story_mention';

      case 'new_follower':
        return triggerData.type === 'new_follower';

      default:
        return false;
    }
  }

  /**
   * Helper: Evaluate condition rule
   */
  private async evaluateCondition(rule: any, context: ExecutionContext): Promise<boolean> {
    switch (rule.type) {
      case 'field':
        const fieldValue = context.variables[rule.field!];
        switch (rule.operator) {
          case 'equals':
            return fieldValue === rule.value;
          case 'contains':
            return String(fieldValue).includes(String(rule.value));
          case 'gt':
            return Number(fieldValue) > Number(rule.value);
          case 'lt':
            return Number(fieldValue) < Number(rule.value);
          case 'exists':
            return fieldValue !== undefined && fieldValue !== null;
          default:
            return false;
        }

      case 'tag':
        return context.user.tags.includes(rule.tag!);

      case 'follower':
        return context.user.isFollower === true;

      case 'time':
        const now = new Date();
        if (rule.dayOfWeek && rule.dayOfWeek.length > 0) {
          const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
          if (!rule.dayOfWeek.includes(currentDay)) {
            return false;
          }
        }
        // Check time range if specified
        if (rule.timeRange) {
          // Implementation depends on format
        }
        return true;

      case 'source':
        return context.channelType === rule.source;

      case 'random':
        return Math.random() < (rule.probability || 0.5);

      default:
        return false;
    }
  }

  /**
   * Helper: Execute action
   */
  private async executeAction(action: Action, context: ExecutionContext, data: any): Promise<void> {
    switch (action.action) {
      case 'message':
        const text = this.replaceVariables(action.text || '', context.variables);
        await this.channelAbstraction.sendMessage(
          context.channelType as any,
          context.channelId,
          context.userId,
          { text }
        );
        break;

      case 'tag':
        if (action.tagValue) {
          context.user.tags.push(action.tagValue);
          // Save to database in production
        }
        break;

      case 'field':
        if (action.fieldKey) {
          context.variables[action.fieldKey] = action.fieldValue;
          // Save to database in production
        }
        break;

      case 'http':
        // Make HTTP request
        break;

      case 'delay':
        if (action.delayMs) {
          await new Promise(resolve => setTimeout(resolve, action.delayMs));
        }
        break;

      case 'goto':
        // Handle flow jump
        break;
    }
  }

  /**
   * Helper: Get next node ID from edges
   */
  private getNextNodeId(currentNodeId: string, context: ExecutionContext): string | null {
    // In a real implementation, this would use the flow's edges
    // For now, return null to end execution
    return null;
  }

  /**
   * Helper: Replace variables in text with actual values
   */
  private replaceVariables(text: string, variables: Record<string, any>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }
}

export default new FlowEngine();
