import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório.")
    .email("Informe um e-mail válido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório.")
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z
    .string()
    .min(1, "E-mail é obrigatório.")
    .email("Informe um e-mail válido."),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres."),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
