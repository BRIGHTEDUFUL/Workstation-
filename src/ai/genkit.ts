'use server';
import {genkit, Flow, Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

// A wrapper to dynamically initialize Google AI with a user-provided key
export async function runWithApiKey<I extends z.ZodType, O extends z.ZodType>(
  ai: Genkit,
  flow: Flow<I, O>,
  input: z.infer<I>
): Promise<z.infer<O>> {
  if (!ai) {
    throw new Error('AI instance is required.');
  }
  const dynamicFlow = ai.flow(
    flow.name,
    flow.inputSchema,
    flow.outputSchema,
    flow.body
  );
  return await dynamicFlow(input);
}
