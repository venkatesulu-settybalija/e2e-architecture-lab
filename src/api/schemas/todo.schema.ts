import { z } from "zod";

export const loginResponseSchema = z.object({
  token: z.string(),
  expiresIn: z.number(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
});

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
});

export const todoListResponseSchema = z.object({
  items: z.array(todoSchema),
});

export type Todo = z.infer<typeof todoSchema>;
