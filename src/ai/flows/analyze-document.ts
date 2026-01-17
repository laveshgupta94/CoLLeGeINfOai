'use server';
/**
 * @fileOverview A Genkit flow for analyzing text documents.
 *
 * - analyzeDocument - Analyzes text content and extracts a title, category, and summary.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDocumentInputSchema = z.object({
  content: z.string().describe('The text content of the document to analyze.'),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

const AnalyzeDocumentOutputSchema = z.object({
  title: z.string().describe('A suitable title for the document.'),
  category: z.string().describe('A suggested category for the document (e.g., "FAQs", "Rules", "Timetable").'),
  description: z.string().describe('A concise summary or the full content of the document, if it is short.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

export async function analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentPrompt',
  input: {schema: AnalyzeDocumentInputSchema},
  output: {schema: AnalyzeDocumentOutputSchema},
  prompt: `Analyze the following document content and generate a suitable title, a category, and a description.
The category should be a single word or short phrase, like "FAQs", "Rules", "Timetable", or "Events".
The description should be a summary of the content, or the full content if it's short.
If the content appears to be a timetable or schedule, set the category to "Timetable".

DOCUMENT CONTENT:
---
{{{content}}}
---
`,
});

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
