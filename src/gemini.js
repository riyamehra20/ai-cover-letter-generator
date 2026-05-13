const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`

function buildPrompt({ name, role, company, experience, skills, jobDescription }) {
  const skillsList = skills.join(', ')
  const expLine = experience ? `${experience} years of experience` : 'relevant experience'
  const jdSection = jobDescription
    ? `\n\nJob Description:\n"""\n${jobDescription}\n"""\nTailor the letter closely to this job description.`
    : ''

  return `You are an expert career coach and professional cover letter writer.

Write a compelling, personalized cover letter for the following candidate.

Candidate Details:
- Name: ${name}
- Applying for: ${role} at ${company}
- Experience: ${expLine}
- Key Skills: ${skillsList}
${jdSection}

Instructions:
- Address it to: "Dear Hiring Manager at ${company},"
- Write exactly 4 paragraphs:
  1. Strong opening hook — why this role excites them
  2. Relevant experience and skills aligned to the role
  3. Why specifically ${company} — show research/interest
  4. Confident closing with call to action
- Tone: warm, professional, confident — not robotic or generic
- Keep it under 380 words
- End with: "Sincerely,\\n${name}"
- Output ONLY the letter text. No commentary, no markdown, no labels.`
}


export async function generateCoverLetter(formData) {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    throw new Error('No API key found. Please add VITE_GEMINI_API_KEY to your .env file.')
  }

  const prompt = buildPrompt(formData)

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024,
      }
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    const msg = error?.error?.message || `API error: ${response.status}`
    throw new Error(msg)
  }

  const data = await response.json()

  // Extract text from Gemini response structure
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini API.')

  return text.trim()
}


export function generateTemplate({ name, role, company, experience, skills }) {
  const skillsList = skills.join(', ')
  const expLine = experience ? `With ${experience} years of hands-on experience` : 'With my hands-on experience'

  return `Dear Hiring Manager at ${company},

I am writing to express my enthusiastic interest in the ${role} position at ${company}. Having followed ${company}'s work closely, I am confident that my background and skills make me an excellent candidate for this role.

${expLine}, I have developed strong expertise in ${skillsList}. I have consistently applied these competencies to deliver measurable results — collaborating across teams, solving complex problems, and driving projects from ideation through to completion.

${company}'s reputation for innovation and excellence is what draws me to this opportunity. I am particularly excited about the prospect of contributing my skills to a team that shares my passion for meaningful, high-impact work.

I would welcome the opportunity to discuss how my experience aligns with your team's goals. Thank you for your time and consideration — I look forward to speaking with you.

Sincerely,
${name}`
}
