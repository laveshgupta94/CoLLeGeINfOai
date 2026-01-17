'use server';

/**
 * @fileOverview An AI agent that answers student queries about college information.
 *
 * - chatbotAnswersStudentQueries - A function that handles the chatbot query and returns an answer.
 * - ChatbotAnswersStudentQueriesInput - The input type for the chatbotAnswersStudentQueries function.
 * - ChatbotAnswersStudentQueriesOutput - The return type for the chatbotAnswersStudentQueries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotAnswersStudentQueriesInputSchema = z.object({
  query: z.string().describe('The student query.'),
  events: z.string().describe('College events data.'),
  exams: z.string().describe('Exam schedules data.'),
  attendanceRules: z.string().describe('Attendance rules data.'),
  knowledgeBase: z.string().describe('General college information.'),
  language: z.string().describe('The language of the student query.'),
});
export type ChatbotAnswersStudentQueriesInput = z.infer<typeof ChatbotAnswersStudentQueriesInputSchema>;

const ChatbotAnswersStudentQueriesOutputSchema = z.object({
  answer: z.string().describe('The answer to the student query.'),
});
export type ChatbotAnswersStudentQueriesOutput = z.infer<typeof ChatbotAnswersStudentQueriesOutputSchema>;

export async function chatbotAnswersStudentQueries(input: ChatbotAnswersStudentQueriesInput): Promise<ChatbotAnswersStudentQueriesOutput> {
  return chatbotAnswersStudentQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotAnswersStudentQueriesPrompt',
  input: {schema: ChatbotAnswersStudentQueriesInputSchema},
  output: {schema: ChatbotAnswersStudentQueriesOutputSchema},
  prompt: `You are CampusAI, a college assistant. Answer the following question in the same language as the question.
When providing information about schedules or timetables (like exam schedules), you MUST format it as a Markdown table.
The table should have columns for Subject, Date, and Time.
Do not include the ID or exam name in the table itself, but you can mention the exam name in the text preceding the table.

For example, a response about an exam schedule should look like this:

Here is the schedule for the Mid-Term Examinations:

| Subject          | Date         | Time      |
|------------------|--------------|-----------|
| Computer Science | Nov 5, 2024  | 9:00 AM   |
| Mathematics      | Nov 7, 2024  | 9:00 AM   |

---
CONTEXT:
Here is some data about college events:
{{events}}

Here is some data about exam schedules:
{{exams}}

Here are the attendance rules:
{{attendanceRules}}

Here is some general college information:
{{knowledgeBase}}
---

Now, answer the following student question:
{{query}}`,
});

const chatbotAnswersStudentQueriesFlow = ai.defineFlow(
  {
    name: 'chatbotAnswersStudentQueriesFlow',
    inputSchema: ChatbotAnswersStudentQueriesInputSchema,
    outputSchema: ChatbotAnswersStudentQueriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
