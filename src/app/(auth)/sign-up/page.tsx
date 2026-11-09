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
import { Alert, AlertDescription } from '@/src/app/_components/ui/alert'

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
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
        mode: 'onBlur',
    })

    const onSubmit = async (data: SignUpFormData) => {
        setApiError('')
        try {
            const { data: result, error: err } = await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
                callbackURL: '/',
            })

            if (err) {
                setApiError('Erro ao criar conta. Tente outro e-mail.')
                return
            }

            if (result) {
                router.replace('/')
                router.refresh()
            }
        } catch {
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
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <label
                        htmlFor="name"
                        className="block text-sm text-zinc-300"
                    >
                        Nome
                    </label>
                    <input
                        id="name"
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
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm text-zinc-300"
                    >
                        E-mail
                    </label>
                    <input
                        id="email"
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
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-sm text-zinc-300"
                    >
                        Senha (mín. 8 caracteres)
                    </label>
                    <input
                        id="password"
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
                </div>

                {apiError && (
                    <Alert variant="destructive">
                        <AlertDescription className="text-destructive">
                            {apiError}
                        </AlertDescription>
                    </Alert>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span>
                        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                    </span>
                    <Image src={ArrowIcon} alt="" />
                </button>
            </form>
        </AuthLayout>
    )
}
