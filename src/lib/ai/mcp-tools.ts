/**
 * MCP Tools - Tier 1 (10 Core Tools)
 * 
 * Tools that give AI access to user data and MTG information
 * Following MCP Server pattern from .cursorrules
 */

import type { MCPTool } from '@/types/ai';

export const mcpTools: MCPTool[] = [
  {
    name: 'get_user_collection',
    description: 'Get all cards in the user\'s collection with quantities',
    input_schema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: 'The user ID to fetch collection for',
        },
      },
      required: ['user_id'],
    },
  },
  {
    name: 'get_user_decks',
    description: 'Get all decks owned by the user',
    input_schema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: 'The user ID to fetch decks for',
        },
        format: {
          type: 'string',
          description: 'Optional: filter by format (commander, standard, modern, etc)',
        },
      },
      required: ['user_id'],
    },
  },
  {
    name: 'search_cards',
    description: 'Search for MTG cards using Scryfall API',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The card name or search query',
        },
        format: {
          type: 'string',
          description: 'Optional: filter by format legality',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_card_details',
    description: 'Get detailed information about a specific card by Scryfall ID',
    input_schema: {
      type: 'object',
      properties: {
        scryfall_id: {
          type: 'string',
          description: 'The Scryfall UUID of the card',
        },
      },
      required: ['scryfall_id'],
    },
  },
  {
    name: 'get_card_prices',
    description: 'Get current prices for a card from Scryfall',
    input_schema: {
      type: 'object',
      properties: {
        scryfall_id: {
          type: 'string',
          description: 'The Scryfall UUID of the card',
        },
      },
      required: ['scryfall_id'],
    },
  },
  {
    name: 'add_card_to_deck',
    description: 'Add a card to a specific deck',
    input_schema: {
      type: 'object',
      properties: {
        deck_id: {
          type: 'string',
          description: 'The deck ID to add the card to',
        },
        scryfall_id: {
          type: 'string',
          description: 'The Scryfall UUID of the card to add',
        },
        quantity: {
          type: 'string',
          description: 'Number of copies to add (default: 1)',
        },
        category: {
          type: 'string',
          description: 'Card category: mainboard, sideboard, or maybeboard',
          enum: ['mainboard', 'sideboard', 'maybeboard'],
        },
      },
      required: ['deck_id', 'scryfall_id'],
    },
  },
  {
    name: 'remove_card_from_deck',
    description: 'Remove a card from a specific deck',
    input_schema: {
      type: 'object',
      properties: {
        deck_id: {
          type: 'string',
          description: 'The deck ID to remove the card from',
        },
        scryfall_id: {
          type: 'string',
          description: 'The Scryfall UUID of the card to remove',
        },
      },
      required: ['deck_id', 'scryfall_id'],
    },
  },
  {
    name: 'analyze_deck',
    description: 'Analyze a deck and return stats (mana curve, color distribution, etc)',
    input_schema: {
      type: 'object',
      properties: {
        deck_id: {
          type: 'string',
          description: 'The deck ID to analyze',
        },
      },
      required: ['deck_id'],
    },
  },
  {
    name: 'validate_deck_format',
    description: 'Check if a deck is legal in its specified format',
    input_schema: {
      type: 'object',
      properties: {
        deck_id: {
          type: 'string',
          description: 'The deck ID to validate',
        },
      },
      required: ['deck_id'],
    },
  },
  {
    name: 'suggest_decks_from_collection',
    description: 'Suggest complete decks that can be built from user\'s collection',
    input_schema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: 'The user ID to analyze collection for',
        },
        format: {
          type: 'string',
          description: 'Optional: specific format to build for',
        },
        max_missing_cards: {
          type: 'string',
          description: 'Maximum number of cards user would need to acquire (default: 10)',
        },
      },
      required: ['user_id'],
    },
  },
];

