/**
 * AI Types
 * 
 * Types for AI chatbot, messages, tools, and context
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
}

export interface UserContext {
  user_id: string;
  current_screen: 'dashboard' | 'deck_builder' | 'collection' | 'deck_list' | 'landing';
  active_deck_id?: string;
  active_card_id?: string;
  collection_summary: {
    total_cards: number;
    total_value: number;
    unique_cards: number;
  };
  preferences: {
    formats: string[];
    budget_preference: 'budget' | 'mid' | 'high' | 'unlimited';
    playstyle?: 'aggro' | 'control' | 'midrange' | 'combo';
  };
  recent_activity: string[];
}

export interface MCPTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export interface ChatRequest {
  messages: Message[];
  context?: Partial<UserContext>;
  stream?: boolean;
}

export interface ChatResponse {
  message: Message;
  toolCalls?: ToolCall[];
}

