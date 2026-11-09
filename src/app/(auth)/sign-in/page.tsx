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
import { Alert, AlertDescription } from '@/src/app/_components/ui/alert'
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
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    })

    const router = useRouter()

    const onSubmit = async (data: SignInFormData) => {
        setApiError('')
        try {
            const { data: result, error: err } = await authClient.signIn.email({
                email: data.email,
                password: data.password,
                callbackURL: '/',
            })

            if (err) {
                setApiError('E-mail ou senha inválidos.')
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
            title="Bem-vindo de volta"
            description="Entre com suas credenciais para continuar"
            footerText="Não tem uma conta?"
            footerLinkText="Criar conta"
            footerHref="/sign-up"
        >
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                        Senha
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
                    <span>{isSubmitting ? 'Entrando...' : 'Entrar'}</span>
                    <Image src={ArrowIcon} alt="" />
                </button>
            </form>
        </AuthLayout>
    )
}
