import { LoadingShell, SKELETON_CARD } from './_components/loading-shell'

export default function Loading() {
    return (
        <LoadingShell>
            <div className="mx-auto w-full max-w-[1120px] space-y-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div
                        className={`h-[249px] bg-primary/30 lg:col-span-2 ${SKELETON_CARD}`}
                    />
                    <div className={`h-[249px] ${SKELETON_CARD}`} />
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className={`h-[460px] ${SKELETON_CARD}`} />
                    <div className={`h-[460px] ${SKELETON_CARD}`} />
                </div>
                <div className={`h-96 ${SKELETON_CARD}`} />
            </div>
        </LoadingShell>
    )
}
