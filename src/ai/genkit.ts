'use server';
import {genkit, Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';
import {ai as globalAi} from './config';

// A wrapper to dynamically initialize Google AI with a user-provided key
export async function runWithApiKey<I extends z.ZodType, O extends z.ZodType>(
  flow: Flow<I, O>,
  input: z.infer<I>,
  apiKey?: string
): Promise<z.infer<O>> {
  if (!apiKey) {
    throw new Error('API key is required.');
  }
  const dynamicAi = genkit({
    plugins: [googleAI({apiKey})],
  });
  const dynamicFlow = dynamicAi.flow(
    flow.name,
    flow.inputSchema,
    flow.outputSchema,
    flow.body
  );
  return await dynamicFlow(input);
}

export {globalAi as ai};
