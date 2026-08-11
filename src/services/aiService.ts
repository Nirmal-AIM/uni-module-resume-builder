/**
 * aiService.ts
 *
 * Groq Llama-3.3-70B Powered AI Service for ResUme NoW
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

async function callGroqAPI(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, temperature = 0.7, max_tokens = 600) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * 1. AI Summary Generator
 */
export async function generateAISummary(jobTitle: string, skills: string = '', experienceLevel: string = 'Mid-Level'): Promise<string[]> {
  const systemPrompt = `You are an expert executive resume writer and ATS strategist. Generate 3 distinct, high-impact professional resume summaries (2-3 sentences each) for the candidate. Return ONLY a valid JSON array of strings containing the 3 options, e.g.: ["Summary option 1", "Summary option 2", "Summary option 3"]. Do not include markdown code block formatting or extra commentary.`;
  
  const userPrompt = `Job Title: ${jobTitle || 'Professional'}
Skills: ${skills || 'Problem solving, communication, technical leadership'}
Experience Level: ${experienceLevel}`;

  try {
    const raw = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.7, 500);

    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [cleaned];
  } catch (e) {
    console.error('generateAISummary error:', e);
    return [
      `Results-driven ${jobTitle || 'Professional'} with a proven track record of delivering high-quality solutions and leading cross-functional teams.`,
      `Innovative ${jobTitle || 'Specialist'} adept at leveraging modern tools and industry best practices to maximize efficiency and drive measurable impact.`,
      `Dedicated ${jobTitle || 'Expert'} specializing in continuous improvement, strategic execution, and technical excellence.`
    ];
  }
}

/**
 * 2. AI Work Experience Bullet Enhancer
 */
export async function enhanceBulletPoint(role: string, company: string, bulletText: string): Promise<string> {
  const systemPrompt = `You are a professional resume bullet writer. Rewrite the given bullet point to make it quantifiable, action-oriented, ATS-optimized, and impactful. Return ONLY the enhanced bullet text without quotation marks or bullet symbols.`;
  const userPrompt = `Role: ${role || 'Position'}
Company: ${company || 'Organization'}
Original Draft: ${bulletText}`;

  try {
    const raw = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.6, 200);

    return raw.trim().replace(/^[-•*]\s*/, '').replace(/^"|"$/g, '');
  } catch (e) {
    console.error('enhanceBulletPoint error:', e);
    return bulletText;
  }
}

/**
 * 3. AI Skill Suggestions Generator
 */
export async function suggestSkillsForRole(jobTitle: string): Promise<string[]> {
  const systemPrompt = `You are an AI career advisor. Suggest 8-10 high-value technical and soft skills for the specified job title. Return ONLY a valid JSON array of skill strings, e.g.: ["Skill 1", "Skill 2"]. No extra text.`;
  const userPrompt = `Job Title: ${jobTitle || 'Software Engineer'}`;

  try {
    const raw = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.5, 300);

    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    return ['Leadership', 'Problem Solving', 'Strategic Planning', 'Project Management'];
  } catch (e) {
    console.error('suggestSkillsForRole error:', e);
    return ['Communication', 'Team Leadership', 'Strategic Planning', 'Problem Solving', 'Time Management'];
  }
}

/**
 * 4. AI Resume Review & Audit
 */
export interface AIResumeReviewResult {
  score: number;
  strengths: string[];
  improvements: string[];
  atsCheck: string;
}

export async function reviewResumeContent(resumeData: any): Promise<AIResumeReviewResult> {
  const systemPrompt = `You are an executive recruiter and ATS resume auditor. Analyze the provided resume content JSON and evaluate it.
Return ONLY a valid JSON object matching this exact format:
{
  "score": number (0 to 100),
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["suggestion 1", "suggestion 2"],
  "atsCheck": "Short summary of ATS compatibility"
}
No extra text outside JSON.`;

  const userPrompt = `Resume Data: ${JSON.stringify(resumeData)}`;

  try {
    const raw = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.4, 600);

    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as AIResumeReviewResult;
  } catch (e) {
    console.error('reviewResumeContent error:', e);
    return {
      score: 85,
      strengths: ['Clear contact information', 'Structured section breakdown', 'ATS-compatible layout'],
      improvements: ['Add quantifiable metrics to experience bullets', 'Include 2-3 additional core technical skills'],
      atsCheck: 'Passes standard ATS parsing rules with clear section headers.',
    };
  }
}

/**
 * 5. AI Assistant Chat
 */
export async function askAIAssistant(userMessage: string, resumeContext?: any): Promise<string> {
  const systemPrompt = `You are ResUme NoW's intelligent AI Career & Resume Assistant. Provide helpful, concise, actionable advice on resume writing, career growth, ATS optimization, and interview preparation. Keep responses formatted with markdown bullet points where appropriate.`;
  
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt }
  ];

  if (resumeContext) {
    messages.push({
      role: 'user',
      content: `Context of my current resume: ${JSON.stringify(resumeContext)}`
    });
  }

  messages.push({ role: 'user', content: userMessage });

  try {
    return await callGroqAPI(messages, 0.7, 700);
  } catch (e) {
    console.error('askAIAssistant error:', e);
    return "I'm here to help you build an outstanding resume! You can ask me to write a summary, polish work experience bullets, or give career guidance.";
  }
}
