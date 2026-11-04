'use client'

import { AuthLayout } from '../_components/auth-layout'
import ArrowIcon from '../../../assets/arrow-icon.png'
import Image from 'next/image'
import { inputClass } from '../_styles/input'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/src/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const signInFormSchema = z.object({
    email: z
        .string()
        .min(1, 'Email é obrigatório.')
        .regex(z.regexes.email, 'Informe um email válido.'),
    password: z.string().min(8, 'A senha precisa ter no mínimo 8 caracteres.'),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function SignInPage() {
    const [apiError, setApiError] = useState<string>('')

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '' as any,
            password: '' as any,
        },
        mode: 'onBlur',
    })

    const router = useRouter()

    const onSubmit = async (data: SignInFormData) => {
        console.log(data)
        try {
            const { data: result, error: err } = await authClient.signIn.email({
                email: data.email,
                password: data.password,
                callbackURL: '/',
            })

            if (err) {
                setApiError(
                    err.message ?? 'Erro ao criar conta. Tente outro email.'
                )
                return
            }

            if (result) router.push('/')

            reset()
        } catch (error) {
            setApiError('Erro inesperado. Tente novamente.')
        }
    }

    return (
        <AuthLayout
            title="Bem-vindo de volta"
            description="Entre com suas credenciais para continuar"
            footerText="Não tem uma conta?"
            footerLinkText="Criar conta"
            footerHref="/sign-up"
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-sm text-zinc-300 mb-2">
                    E-mail
                </label>
                <input
                    type="email"
                    placeholder="seu@email.com"
                    className={inputClass}
                    {...register('email')}
                />

                {errors.email && (
                    <p className="text-xs text-red-500">
                        {errors.email.message}
                    </p>
                )}

                <label className="block text-sm text-zinc-300 mb-2">
                    Senha
                </label>
                <input
                    type="password"
                    placeholder="••••••••"
                    className={inputClass}
                    {...register('password')}
                />

                {errors.password && (
                    <p className="text-xs text-red-500">
                        {errors.password.message}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#9333EA] flex items-center 
                justify-center gap-2 font-semibold rounded-2xl py-4 cursor-pointer"
                >
                    <span>Entrar</span>
                    <Image src={ArrowIcon} alt="Ícone de seta do botão" />
                </button>
            </form>
        </AuthLayout>
    )
}