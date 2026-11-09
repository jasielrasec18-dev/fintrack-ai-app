'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import searchIcon from '@/src/assets/search-icon.png'
import {
    TRANSACTION_CATEGORY_OPTIONS,
    TRANSACTION_TYPE_OPTIONS,
} from '../_constants/transaction'
import { Input } from './ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'

const ALL = 'ALL'
const fieldClass =
    'h-10 rounded-xl border border-white/10 bg-[#1E293B]/80 text-sm text-white placeholder:text-text-subtle'

export const TransactionFilters = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

    const updateFilter = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value && value !== ALL) {
            params.set(name, value)
        } else {
            params.delete(name)
        }
        params.delete('page')

        router.replace(`${pathname}?${params.toString()}`)
    }

    const handleSearch = (value: string) => {
        clearTimeout(searchTimer.current)
        searchTimer.current = setTimeout(() => updateFilter('q', value), 300)
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px_150px_150px]">
            <div className="relative sm:col-span-2 xl:col-span-1">
                <Image
                    src={searchIcon}
                    alt=""
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
                />
                <Input
                    type="search"
                    aria-label="Buscar transação pelo nome"
                    placeholder="Buscar pelo nome"
                    defaultValue={searchParams.get('q') ?? ''}
                    onChange={(event) => handleSearch(event.target.value)}
                    className={`${fieldClass} pl-10`}
                />
            </div>

            <Select
                value={searchParams.get('type') ?? ALL}
                onValueChange={(value) => updateFilter('type', value)}
            >
                <SelectTrigger aria-label="Filtrar por tipo" className={fieldClass}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectItem value={ALL}>Todos os tipos</SelectItem>
                    {TRANSACTION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={searchParams.get('category') ?? ALL}
                onValueChange={(value) => updateFilter('category', value)}
            >
                <SelectTrigger
                    aria-label="Filtrar por categoria"
                    className={fieldClass}
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectItem value={ALL}>Todas as categorias</SelectItem>
                    {TRANSACTION_CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                type="date"
                aria-label="Data inicial"
                defaultValue={searchParams.get('from') ?? ''}
                onChange={(event) => updateFilter('from', event.target.value)}
                className={`${fieldClass} scheme-dark`}
            />
            <Input
                type="date"
                aria-label="Data final"
                defaultValue={searchParams.get('to') ?? ''}
                onChange={(event) => updateFilter('to', event.target.value)}
                className={`${fieldClass} scheme-dark`}
            />
        </div>
    )
}
