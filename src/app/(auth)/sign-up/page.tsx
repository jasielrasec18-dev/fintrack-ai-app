'use client'

import Image from 'next/image'
import { AuthLayout } from '../_components/auth-layout'
import ArrowIcon from '../../../assets/arrow-icon.png'
import { inputClass } from '../_styles/input'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/src/lib/auth-client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const signUpFormSchema = z.object({
    name: z.string().trim().nonempty('O nome é obrigatório'),
    email: z.string().nonempty('O email é obrigatório.'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
})

type SignUpFormData = z.input<typeof signUpFormSchema>

export default function SignUpPage() {
    const [apiError, setApiError] = useState<string>('')

    const router = useRouter()

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: '' as any,
            email: '' as any,
            password: '' as any,
        },
        mode: 'onBlur',
    })

    const onSubmit = async (data: SignUpFormData) => {
        console.log(data)
        try {
            const { data: result, error: err } = await authClient.signUp.email({
                name: data.name,
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
            title="Criar conta"
            description="Preencha os dados para começar"
            footerText="Já tem uma conta?"
            footerLinkText="Entrar"
            footerHref="/sign-in"
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-sm text-zinc-300 mb-2">Nome</label>
                <input
                    type="text"
                    placeholder="Seu nome"
                    className={inputClass}
                    {...register('name')}
                />

                {errors.name && (
                    <p className="text-xs text-red-500">
                        {errors.name.message}
                    </p>
                )}

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
                    Senha (mín. 8 caracteres)
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
                    className="w-full bg-[#9333EA] flex items-center justify-center 
                    gap-2 font-semibold rounded-2xl py-4 cursor-pointer"
                    disabled={isSubmitting}
                >
                    <span>Criar conta</span>
                    <Image src={ArrowIcon} alt="Ícone de seta do botão" />
                </button>
            </form>
        </AuthLayout>
    )
}