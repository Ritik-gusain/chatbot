/**
 * =========================================================
 *  /api/chat.js — Luminescent.io AI Proxy
 *  Vercel serverless function that proxies requests to
 *  Anthropic's Claude API. Keeps the API key server-side.
 *
 *  Setup:
 *    1. npm install @anthropic-ai/sdk   (in project root)
 *    2. Add ANTHROPIC_API_KEY to Vercel Environment Variables
 *    3. Deploy — this file is auto-detected as a function
 * =========================================================
 */

const Anthropic = require('@anthropic-ai/sdk');

const ALLOWED_MODELS = new Set([
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
]);

const DEFAULT_MODEL  = 'claude-3-5-haiku-20241022';
const MAX_TOKENS     = 1024;
const DEFAULT_SYSTEM = 'You are Luminescent AI, a helpful and intelligent assistant for teams. Provide clear, concise, and accurate responses.';

module.exports = async function handler(req, res) {
  /* ── CORS headers ── */
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  /* Preflight */
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* ── Validate body ── */
  const { messages, systemPrompt, model } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  /* Sanitize model selection — never trust the client entirely */
  const chosenModel = ALLOWED_MODELS.has(model) ? model : DEFAULT_MODEL;

  /* Strip any empty messages that would fail Anthropic validation */
  const cleanMessages = messages
    .filter(m => m && m.role && typeof m.content === 'string' && m.content.trim())
    .map(m => ({
      role:    m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content.trim()
    }));

  if (cleanMessages.length === 0) {
    return res.status(400).json({ error: 'No valid messages provided' });
  }

  /* ── Check API key ── */
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[Luminescent] ANTHROPIC_API_KEY is not set');
    return res.status(500).json({
      error: 'AI service is not configured. Add ANTHROPIC_API_KEY to your Vercel environment variables.'
    });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model:      chosenModel,
      max_tokens: MAX_TOKENS,
      system:     (systemPrompt || DEFAULT_SYSTEM).slice(0, 2000), /* cap system prompt */
      messages:   cleanMessages,
    });

    const reply = response.content?.[0]?.text;

    if (!reply) {
      return res.status(502).json({ error: 'No content returned from AI' });
    }

    return res.status(200).json({
      reply,
      model:         chosenModel,
      input_tokens:  response.usage?.input_tokens  ?? 0,
      output_tokens: response.usage?.output_tokens ?? 0,
    });

  } catch (err) {
    console.error('[Luminescent] Anthropic API error:', err.message);

    /* Map Anthropic errors to friendly messages */
    if (err.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Check ANTHROPIC_API_KEY.' });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please try again shortly.' });
    }
    if (err.status === 400) {
      return res.status(400).json({ error: 'Invalid request: ' + err.message });
    }

    return res.status(500).json({ error: 'AI service temporarily unavailable. Please try again.' });
  }
};
