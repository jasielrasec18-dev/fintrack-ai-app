import {
    LoadingShell,
    SKELETON_CARD,
} from '@/src/app/_components/loading-shell'

export default function Loading() {
    return (
        <LoadingShell>
            <div className="h-16 w-72 rounded-2xl bg-card" />
            <div className="mt-6 h-10 rounded-xl bg-card" />
            <div className={`mt-6 h-[520px] ${SKELETON_CARD}`} />
        </LoadingShell>
    )
}
