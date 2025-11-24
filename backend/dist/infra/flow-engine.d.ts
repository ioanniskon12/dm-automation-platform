import type { Flow, UserContact } from '../../../shared/types.js';
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
export declare class FlowEngine {
    private compliance;
    private channelAbstraction;
    private aiService;
    constructor();
    /**
     * Execute a flow from start to finish
     */
    execute(flow: Flow, user: UserContact, channelId: string, channelType: string, triggerData: any): Promise<ExecutionResult>;
    /**
     * Execute a single node and progress to next
     */
    private executeNode;
    /**
     * MESSAGE NODE - Send message with compliance checks
     */
    private executeMessageNode;
    /**
     * QUESTIONNAIRE NODE - Collect user input
     */
    private executeQuestionnaireNode;
    /**
     * CONDITION NODE - Branch based on conditions
     */
    private executeConditionNode;
    /**
     * HTTP NODE - Make external API request
     */
    private executeHTTPNode;
    /**
     * Helper: Check if trigger matches
     */
    private checkTrigger;
    /**
     * Helper: Evaluate condition rule
     */
    private evaluateCondition;
    /**
     * Helper: Execute action
     */
    private executeAction;
    /**
     * Helper: Get next node ID from edges
     */
    private getNextNodeId;
    /**
     * Helper: Replace variables in text with actual values
     */
    private replaceVariables;
}
declare const _default: FlowEngine;
export default _default;
//# sourceMappingURL=flow-engine.d.ts.map