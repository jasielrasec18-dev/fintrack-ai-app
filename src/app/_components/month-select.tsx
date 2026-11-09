'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { MONTH_OPTIONS } from '../_constants/months'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'

interface MonthSelectProps {
    month: string
}

export const MonthSelect = ({ month }: MonthSelectProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function handleChange(value: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('month', value)
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Select value={month} onValueChange={handleChange}>
            <SelectTrigger
                aria-label="Selecionar mês"
                className="h-9 data-[size=default]:h-9 rounded-lg border-none bg-[#1E293B] px-3 text-sm text-[#CBD5E1]"
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
                {MONTH_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
