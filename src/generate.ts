import { GEMINI_API_KEY, GEMINI_API_URL } from './config';
import { GeminiResponse } from './types';

export async function generateComment(code: string): Promise<string> {
    try {
        const prompt = `Generate a concise, professional code comment for this code.
Focus on explaining the purpose and functionality. ${code}
Comment:`;
        const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                contents:[{parts:[{text:prompt}]}],
            }),
        }
    );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as GeminiResponse;
        
        if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid API response structure');
        }

        return data.candidates[0].content.parts[0].text.trim();

    } catch (error) {
        console.error('Error generating comment:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to generate comment');
    }
}