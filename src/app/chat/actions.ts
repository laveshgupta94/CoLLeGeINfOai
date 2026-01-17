'use server';

import { chatbotAnswersStudentQueries } from '@/ai/flows/chatbot-answers-student-queries';
import { mockEvents, mockExams, mockAttendanceRule, mockKnowledgeBase } from '@/lib/mock-data';

export async function getAiResponse(query: string) {
  // In a real app, this data would be fetched from a database based on context.
  // For this demo, we'll use our mock data.
  const events = JSON.stringify(mockEvents);
  const exams = JSON.stringify(mockExams);
  const attendanceRules = JSON.stringify(mockAttendanceRule);
  const knowledgeBase = JSON.stringify(mockKnowledgeBase);

  try {
    const result = await chatbotAnswersStudentQueries({
      query,
      events,
      exams,
      attendanceRules,
      knowledgeBase,
      language: 'English', // The proposal asks for auto-detection, but the AI flow needs it as input. For this version, we will hardcode English.
    });
    return { answer: result.answer };
  } catch (error) {
    console.error('AI Error:', error);
    return { error: 'Sorry, I am having trouble connecting to my brain. Please try again later.' };
  }
}
