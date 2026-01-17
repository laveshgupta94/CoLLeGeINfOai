import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  date: z.string().min(1, { message: 'Date is required.' }),
  time: z.string().min(1, { message: 'Time is required.' }),
  venue: z.string().min(3, { message: 'Venue must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
});

export type EventFormValues = z.infer<typeof eventSchema>;


export const knowledgeSchema = z.object({
    category: z.string().min(2, { message: 'Category is required.' }),
    title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
});

export type KnowledgeFormValues = z.infer<typeof knowledgeSchema>;
