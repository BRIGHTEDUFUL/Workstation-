'use server';

import {genkit, ai} from '@genkit-ai/next';
import {googleAI} from '@genkit-ai/googleai';

genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export {ai};
