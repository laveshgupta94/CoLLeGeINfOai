import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  date: z.string().min(1, { message: 'Date is required.' }),
  time: z.string().min(1, { message: 'Time is required.' }),
  venue: z.string().min(3, { message: 'Venue must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export const examSubjectSchema = z.object({
  subject: z.string().min(3, { message: 'Subject name must be at least 3 characters.' }),
  date: z.string().min(1, { message: 'Date is required.' }),
  time: z.string().min(1, { message: 'Time is required.' }),
});

export const examSchema = z.object({
  exam_name: z.string().min(3, { message: 'Exam name must be at least 3 characters.' }),
  start_date: z.string().min(1, { message: 'Start date is required.' }),
  end_date: z.string().min(1, { message: 'End date is required.' }),
  subjects: z.array(examSubjectSchema).min(1, { message: 'At least one subject is required.' }),
}).refine(data => data.end_date >= data.start_date, {
  message: 'End date cannot be before start date.',
  path: ['end_date'],
});

export type ExamFormValues = z.infer<typeof examSchema>;


export const knowledgeSchema = z.object({
    category: z.string().min(2, { message: 'Category is required.' }),
    title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
});

export type KnowledgeFormValues = z.infer<typeof knowledgeSchema>;
