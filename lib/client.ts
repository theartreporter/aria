import Anthropic from '@anthropic-ai/sdk'

// This will only work on the server side where ANTHROPIC_API_KEY is available
export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set')
  }

  return new Anthropic({
    apiKey,
  })
}
