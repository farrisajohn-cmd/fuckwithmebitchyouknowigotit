import { Configuration, OpenAIApi } from 'openai-edge';
import type { NextRequest } from 'next/server';
import calculateFHAQuote from '../../../lib/calculateFHAQuote';

export const runtime = 'edge';

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const principal = parseFloat(message) || 0;
  const quote = calculateFHAQuote({ principal });
  const response = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an FHA loan calculator.' },
      { role: 'user', content: `User asked: ${message}. FHA quote: ${quote}` }
    ],
    stream: true
  });
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}