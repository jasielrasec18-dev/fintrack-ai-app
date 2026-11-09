import { GoogleGenAI } from '@google/genai'

export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.8-flash'

// Modelos com raciocínio consomem o mesmo limite de tokens da resposta.
export const GEMINI_MAX_OUTPUT_TOKENS = 1024

export function createGeminiClient(apiKey: string) {
    return new GoogleGenAI({
        apiKey,
        // Uma nova tentativa em picos de demanda, sem passar do maxDuration.
        httpOptions: {
            timeout: 12_000,
            retryOptions: { attempts: 2, httpStatusCodes: [503, 504] },
        },
    })
}
