import { GEMINI_API_KEY, GEMINI_API_URL } from './config';
import { GeminiResponse } from './types';

export async function generateComment(code: string): Promise<string> {
    try {
       const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{  
                    parts: [{
                        text: `Generate a concise, professional comment explaining the purpose and functionality of this 
                        code:${code}
                        Only output the comment as plain text, do not wrap it in any markdown or code block.`
                    }]
                }]
            })
        });
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