'use server';
import {genkit, Flow, Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

export function runWithApiKey<I extends z.ZodType, O extends z.ZodType>(
  ai: Genkit,
  flow: Flow<z.infer<I>, z.infer<O>>,
  input: z.infer<I>,
): Promise<z.infer<O>> {
  return ai.run(flow, input);
}
