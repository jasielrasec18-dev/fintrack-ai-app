import { ImageResponse } from 'next/og'

export const alt = 'FinTrack AI: controle financeiro pessoal com insights de IA'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 32,
                    background: '#0F111A',
                    color: '#FFFFFF',
                }}
            >
                <div
                    style={{
                        width: 128,
                        height: 128,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 32,
                        background: '#9333EA',
                    }}
                >
                    <svg width="88" height="88" viewBox="0 0 32 32">
                        <path
                            d="M5 23l8-8 4 4 10-10m0 0h-6m6 0v6"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <div style={{ fontSize: 84, fontWeight: 700 }}>FinTrack AI</div>
                <div style={{ fontSize: 34, color: '#94A3B8' }}>
                    Controle financeiro pessoal com insights de IA
                </div>
            </div>
        ),
        size
    )
}
