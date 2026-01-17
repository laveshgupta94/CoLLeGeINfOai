'use server';

import { analyzeDocument } from '@/ai/flows/analyze-document';
import type { AnalyzeDocumentOutput } from '@/ai/flows/analyze-document';

export async function analyzeDocumentAction(content: string): Promise<AnalyzeDocumentOutput | { error: string }> {
  try {
    const result = await analyzeDocument({ content });
    return result;
  } catch (error) {
    console.error('AI Error analyzing document:', error);
    return { error: 'Failed to analyze document. Please check the content and try again.' };
  }
}
