import { GEMINI_API_KEY, GEMINI_API_URL } from './config';
import { GeminiResponse } from './types';

export async function generateComment(code: string): Promise<string> {
    try {
        const prompt = promptGenerator(code);
       const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{  
                    parts: [{
                        text: prompt
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

function promptGenerator(code: string): string {
    // detect language and structure
    const language = detectLanguage(code);
    const hasFunctions = hasFunctionDefinitions(code);
    const hasClasses = hasClassDefinitions(code);
    const isScript = isLikelyScript(code);
    

    let prompt = `Generate a short, concise, professional comment explaining the `;
    
    if (hasClasses && hasFunctions) {
        prompt += `overall architecture and purpose of this ${language} code, including main classes and functions`;
    } else if (hasClasses) {
        prompt += `purpose and structure of this ${language} class`;
    } else if (hasFunctions) {
        prompt += `functionality and purpose of this ${language} function`;
    } else if (isScript) {
        prompt += `purpose and execution flow of this ${language} script`;
    } else {
        prompt += `purpose and functionality of this ${language} code`;
    }
    
    prompt += `:\n${code}\n\nOnly output the comment as plain text, do not wrap it in any markdown or code block.`;
    
    return prompt;
}


function detectLanguage(code: string): string {
    if (code.includes('def ') && code.includes('import ')) return 'Python';
    if (code.includes('function ') || code.includes('=>') || code.includes('const ') || code.includes('let ')) return 'JavaScript/TypeScript';
    if (code.includes('public class ') || code.includes('private ') || code.includes('void ')) return 'Java';
    if (code.includes('#include ') || code.includes('int main()')) return 'C/C++';
    if (code.includes('<?php')) return 'PHP';
    if (code.includes('package ') || code.includes('func ')) return 'Go';
    if (code.includes('fn ') || code.includes('let ') || code.includes('mut ')) return 'Rust';
    if (code.includes('using ') && (code.includes('namespace ') || code.includes('class '))) return 'C#';
    return 'code';
}

function hasFunctionDefinitions(code: string): boolean {
    const functionPatterns = [
        /function\s+\w+\(/,
        /def\s+\w+\(/,
        /fn\s+\w+\(/,
        /func\s+\w+\(/,
        /const\s+\w+\s*=\s*\([^)]*\)\s*=>/,
        /let\s+\w+\s*=\s*function\(/,
        /public|private|protected\s+(static\s+)?\w+\s+\w+\(/
    ];
    return functionPatterns.some(pattern => pattern.test(code));
}

function hasClassDefinitions(code: string): boolean {
    const classPatterns = [
        /class\s+\w+/,
        /interface\s+\w+/,
        /struct\s+\w+/,
        /public\s+class\s+\w+/,
        /private\s+class\s+\w+/
    ];
    return classPatterns.some(pattern => pattern.test(code));
}

function isLikelyScript(code: string): boolean {
    const scriptPatterns = [
        /import\s+[\w{},\s*]+from/,
        /require\(/,
        /#!/,
        /console\.log/,
        /print\(/,
        /System\.out\.println/
    ];
    return scriptPatterns.some(pattern => pattern.test(code)) && 
           !hasFunctionDefinitions(code) && 
           !hasClassDefinitions(code);
}