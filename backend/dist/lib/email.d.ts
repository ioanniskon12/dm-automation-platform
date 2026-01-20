interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
interface EmailResult {
    success: boolean;
    messageId?: string;
    previewUrl?: string;
    error?: string;
    dev?: boolean;
}
export declare const sendEmail: (options: EmailOptions) => Promise<EmailResult>;
export declare const emailTemplates: {
    passwordReset: (name: string, resetUrl: string) => {
        subject: string;
        html: string;
    };
    welcome: (name: string, dashboardUrl: string) => {
        subject: string;
        html: string;
    };
    emailVerification: (name: string, verifyUrl: string) => {
        subject: string;
        html: string;
    };
    passwordChanged: (name: string) => {
        subject: string;
        html: string;
    };
    newLoginAlert: (name: string, deviceInfo: {
        browser: string;
        os: string;
        ip: string;
        location?: string;
    }) => {
        subject: string;
        html: string;
    };
    planUpdated: (name: string, planName: string, features: string[]) => {
        subject: string;
        html: string;
    };
    weeklyReport: (name: string, stats: {
        messages: number;
        automations: number;
        engagement: string;
        topFlow: string;
    }) => {
        subject: string;
        html: string;
    };
    teamInvitation: (inviterName: string, workspaceName: string, inviteUrl: string) => {
        subject: string;
        html: string;
    };
};
declare const _default: {
    sendEmail: (options: EmailOptions) => Promise<EmailResult>;
    emailTemplates: {
        passwordReset: (name: string, resetUrl: string) => {
            subject: string;
            html: string;
        };
        welcome: (name: string, dashboardUrl: string) => {
            subject: string;
            html: string;
        };
        emailVerification: (name: string, verifyUrl: string) => {
            subject: string;
            html: string;
        };
        passwordChanged: (name: string) => {
            subject: string;
            html: string;
        };
        newLoginAlert: (name: string, deviceInfo: {
            browser: string;
            os: string;
            ip: string;
            location?: string;
        }) => {
            subject: string;
            html: string;
        };
        planUpdated: (name: string, planName: string, features: string[]) => {
            subject: string;
            html: string;
        };
        weeklyReport: (name: string, stats: {
            messages: number;
            automations: number;
            engagement: string;
            topFlow: string;
        }) => {
            subject: string;
            html: string;
        };
        teamInvitation: (inviterName: string, workspaceName: string, inviteUrl: string) => {
            subject: string;
            html: string;
        };
    };
};
export default _default;
//# sourceMappingURL=email.d.ts.map