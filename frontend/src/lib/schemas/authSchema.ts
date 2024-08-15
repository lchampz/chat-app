"use client";

import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(1, { message: "Senha obrigatória" }),
});

export type SignInData = z.infer<typeof signInSchema>;

const signUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nome obrigatório." })
    .max(80, { message: "Nome muito grande." }),
  email: z
    .string()
    .email({ message: "Email inválido." })
    .max(254, { message: "Email muito grande." }),
  password: z
    .string()
    .min(1, { message: "Senha obrigatório." })
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).+$/, {
      message:
        "A senha deve conter pelo menos uma letra, um número e um caracter especial",
    }),
});

export type SignUpData = z.infer<typeof signUpSchema>;
