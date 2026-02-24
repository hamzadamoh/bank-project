import { llmService, Message } from "./llm.js";

interface KycRequest {
    documentType: string;
    imageBuffer: Buffer;
    mimeType: string;
}

interface KycResponse {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    extractedInfo: any;
    notes: string;
}

interface CreditAssessmentRequest {
    financialData: any;
    context?: string;
}

interface CreditAssessmentResponse {
    score: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendation: string;
    metadata: any;
}

export class FinancialAssessor {
    /**
     * Automates KYC document analysis
     */
    async processKyc(request: KycRequest, options: { provider?: 'cloud' | 'local' } = {}): Promise<KycResponse> {
        const prompt = `Analyze this ${request.documentType} and extract personal information for KYC. 
    Return JSON: { "extractedInfo": { "name": string, "idNumber": string, "expiryDate": string, "address": string }, "isLegitimate": boolean, "notes": string }`;

        try {
            const result = await llmService.vision({
                prompt,
                imageBuffer: request.imageBuffer,
                mimeType: request.mimeType,
                provider: options.provider
            });

            if (!result) throw new Error("KYC Extraction Failed");

            return {
                status: result.isLegitimate ? 'APPROVED' : 'REJECTED',
                extractedInfo: result.extractedInfo,
                notes: result.notes || "Automated KYC analysis completed."
            };
        } catch (error) {
            console.error("KYC Service Error:", error);
            return {
                status: 'REJECTED',
                extractedInfo: {},
                notes: "KYC processing failed due to service error."
            };
        }
    }

    /**
     * Performs AI-driven credit risk assessment
     */
    async assessCreditRisk(request: CreditAssessmentRequest, options: { provider?: 'cloud' | 'local' } = {}): Promise<CreditAssessmentResponse> {
        const messages: Message[] = [
            {
                role: 'system',
                content: 'You are a senior credit risk officer. Analyze financial data and provide a risk assessment. Return JSON.',
            },
            {
                role: 'user',
                content: `Assess the credit risk for this financial profile: ${JSON.stringify(request.financialData)}. 
        Context: ${request.context || 'General banking loan request'}.
        
        Format as JSON: { "score": string, "riskLevel": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", "recommendation": string, "metadata": object }`,
            },
        ];

        try {
            const responseText = await llmService.chat(messages, {
                temperature: 0.2,
                responseFormat: { type: 'json_object' },
                provider: options.provider
            });

            const assessment = JSON.parse(responseText);

            return {
                score: assessment.score || "N/A",
                riskLevel: assessment.riskLevel || "MEDIUM",
                recommendation: assessment.recommendation || "Manual review required",
                metadata: assessment.metadata || {}
            };
        } catch (error) {
            console.error("Credit Assessment Error:", error);
            return {
                score: "0",
                riskLevel: "CRITICAL",
                recommendation: "System error during assessment. Rejecting for safety.",
                metadata: { error: "Assessment failed" }
            };
        }
    }
}

export const financialAssessor = new FinancialAssessor();
