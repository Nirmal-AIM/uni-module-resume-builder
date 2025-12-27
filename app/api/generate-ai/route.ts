import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { type, context } = await request.json();

        if (!type || !context) {
            return NextResponse.json(
                { error: 'Type and context are required' },
                { status: 400 }
            );
        }

        // Build prompt based on type
        let prompt = '';
        let maxTokens = 150;

        if (type === 'job-description') {
            prompt = `Write EXACTLY 3 bullet points for this job:

Job: ${context.jobTitle || 'Not specified'} at ${context.company || 'Not specified'}
Duration: ${context.from || 'Not specified'} - ${context.to || 'Present'}

Rules:
- EXACTLY 3 bullet points
- Each: 10-12 words max
- Start with action verbs
- Focus on achievements
- Format: • [text]`;
            maxTokens = 120;
        } else if (type === 'project-description') {
            prompt = `Write EXACTLY 3 bullet points for this project:

Project: ${context.name || 'Not specified'}
Role: ${context.role || 'Not specified'}

Rules:
- EXACTLY 3 bullet points
- Each: 10-12 words max
- Describe role and impact
- Format: • [text]`;
            maxTokens = 120;
        } else if (type === 'summary') {
            prompt = `Write a 2-sentence professional summary:

Title: ${context.jobTitle || 'Professional'}
Skills: ${context.skills || 'Various skills'}

Rules:
- EXACTLY 2 sentences
- Maximum 40 words total
- Highlight expertise`;
            maxTokens = 80;
        } else {
            return NextResponse.json(
                { error: 'Invalid type. Use: job-description, project-description, or summary' },
                { status: 400 }
            );
        }

        // Check if API key exists
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error('GROQ_API_KEY is not set in environment variables');
            return NextResponse.json(
                { error: 'API key not configured. Please set GROQ_API_KEY in environment variables.' },
                { status: 500 }
            );
        }

        console.log('Calling Groq API with key:', apiKey.substring(0, 10) + '...');

        // Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a concise resume writer. Follow instructions exactly. Be brief and impactful.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: maxTokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Groq API error:', error);
            return NextResponse.json(
                { error: 'Failed to generate content', details: error },
                { status: 500 }
            );
        }

        const data = await response.json();
        const generatedText = data.choices[0]?.message?.content || '';

        return NextResponse.json({
            success: true,
            text: generatedText.trim()
        });

    } catch (error) {
        console.error('AI generation error:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate content',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
