/**
 * AI Chat API Route
 * 
 * Handles chat requests to Claude AI with MCP tools
 * Supports streaming responses
 */

import { createServerClient } from '@/lib/supabase/server';
import { mcpTools } from '@/lib/ai/mcp-tools';
import { buildSystemPrompt } from '@/lib/ai/context';
import type { ChatRequest } from '@/types/ai';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse request
    const body: ChatRequest = await request.json();
    const { messages, context } = body;

    if (!messages || messages.length === 0) {
      return new Response('No messages provided', { status: 400 });
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt({
      ...context,
      user_id: user.id,
    });

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });

    // Format messages for Claude
    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: msg.content,
    }));

    // Call Claude with streaming
    // @ts-ignore - Anthropic SDK type complexity
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: claudeMessages,
      tools: mcpTools,
      stream: true,
    });

    // Create streaming response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                const text = event.delta.text;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }

            if (event.type === 'message_stop') {
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              controller.close();
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

