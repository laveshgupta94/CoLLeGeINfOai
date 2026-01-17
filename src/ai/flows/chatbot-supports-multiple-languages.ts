'use server';

/**
 * @fileOverview An AI agent that supports multiple languages for the chatbot.
 *
 * - chatbotSupportsMultipleLanguages - A function that handles the chatbot conversation with multi-language support.
 * - ChatbotSupportsMultipleLanguagesInput - The input type for the chatbotSupportsMultipleLanguages function.
 * - ChatbotSupportsMultipleLanguagesOutput - The return type for the chatbotSupportsMultipleLanguages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotSupportsMultipleLanguagesInputSchema = z.object({
  message: z.string().describe('The message from the user.'),
  language: z
    .string()
    .optional()
    .describe('The language of the user message. If not provided, it will be detected automatically.'),
  events: z.string().describe('The events data.'),
  exams: z.string().describe('The exams data.'),
  attendance_rules: z.string().describe('The attendance rules data.'),
});
export type ChatbotSupportsMultipleLanguagesInput = z.infer<typeof ChatbotSupportsMultipleLanguagesInputSchema>;

const ChatbotSupportsMultipleLanguagesOutputSchema = z.object({
  response: z.string().describe('The response from the AI chatbot in the user specified language.'),
});
export type ChatbotSupportsMultipleLanguagesOutput = z.infer<typeof ChatbotSupportsMultipleLanguagesOutputSchema>;

export async function chatbotSupportsMultipleLanguages(
  input: ChatbotSupportsMultipleLanguagesInput
): Promise<ChatbotSupportsMultipleLanguagesOutput> {
  return chatbotSupportsMultipleLanguagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotSupportsMultipleLanguagesPrompt',
  input: {schema: ChatbotSupportsMultipleLanguagesInputSchema},
  output: {schema: ChatbotSupportsMultipleLanguagesOutputSchema},
  prompt: `You are CampusAI, a college assistant.

Respond to the user message in the same language as the user message.

DATA: Events: {{{events}}} Exams: {{{exams}}} Attendance Rules: {{{attendance_rules}}}

USER: {{{message}}}`,
});

const chatbotSupportsMultipleLanguagesFlow = ai.defineFlow(
  {
    name: 'chatbotSupportsMultipleLanguagesFlow',
    inputSchema: ChatbotSupportsMultipleLanguagesInputSchema,
    outputSchema: ChatbotSupportsMultipleLanguagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
