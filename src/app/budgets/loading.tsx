import {
    LoadingShell,
    SKELETON_CARD,
} from '@/src/app/_components/loading-shell'

export default function Loading() {
    return (
        <LoadingShell>
            <div className="mx-auto w-full max-w-[1120px]">
                <div className="h-16 w-72 rounded-2xl bg-card" />
                <div className={`mt-6 h-96 ${SKELETON_CARD}`} />
            </div>
        </LoadingShell>
    )
}
