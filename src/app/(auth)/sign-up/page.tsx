"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signUpSchema, type SignUpFormData } from "@/src/app/(auth)/_schemas/auth";

const inputClassName =
  "w-full px-4 py-3.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (data: SignUpFormData) => {
    // Autenticação será conectada em uma aula futura.
    console.log("sign-up (somente UI):", data);
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#18181b] p-8 rounded-4xl shadow-2xl border border-slate-200 dark:border-zinc-800 transition-all duration-300">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
              <span className="material-symbols-rounded text-white text-4xl">
                attach_money
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Criar conta
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              Preencha os dados para começar
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1"
              >
                Nome
              </label>
              <input
                className={inputClassName}
                id="name"
                placeholder="Seu nome"
                type="text"
                autoComplete="name"
                disabled={isSubmitting}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-400 ml-1">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1"
              >
                E-mail
              </label>
              <input
                className={inputClassName}
                id="email"
                placeholder="seu@email.com"
                type="email"
                autoComplete="email"
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-400 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1"
              >
                Senha (mín. 8 caracteres)
              </label>
              <input
                className={inputClassName}
                id="password"
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-400 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              className="w-full bg-primary hover:bg-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-purple-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              Criar conta
            </button>
          </form>
          <div className="mt-10 text-center">
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              Já tem uma conta?{" "}
              <Link
                href="/sign-in"
                className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
