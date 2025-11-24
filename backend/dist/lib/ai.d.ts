export declare class AIService {
    private client;
    constructor();
    processMessage(text: string, config: any, context: Record<string, any>): Promise<{
        text: string;
    }>;
    private answer;
    private rewrite;
    extractField(text: string, fieldType: string): Promise<any>;
}
declare const _default: AIService;
export default _default;
//# sourceMappingURL=ai.d.ts.map