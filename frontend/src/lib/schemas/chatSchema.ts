"use client"
import { z } from 'zod';

export const newChatSchema = z.object({
    email: z.string().email({message: "Email inválido."})
});

export type NewChatData = z.infer<typeof newChatSchema>;