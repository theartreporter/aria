export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agent, question } = req.body;

  const SYSTEM_PROMPTS = {
    maya: `You are Maya Chen, VP of Design at Airbnb & Apple. Keep responses to 2-3 sentences.`,
    kai: `You are Kai Hoffman, Software Architect. Keep responses to 2-3 sentences.`,
    isabelle: `You are Isabelle Voss with 20 years of gallery experience. Keep responses to 2-3 sentences.`,
    marcus: `You are Marcus Webb, Art Market Analyst. Keep responses to 2-3 sentences.`,
    senna: `You are Senna Park, UX Strategist. Keep responses to 2-3 sentences.`
  };

  try {
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 256,
      system: SYSTEM_PROMPTS[agent],
      messages: [{ role: 'user', content: question }]
    });

    res.json({ response: message.content[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get response' });
  }
}
