import { cn } from '@/lib/utils'

interface Props {
  className?: string
  label?: string
}

export default function BookPageLoader({ className, label = 'Loading Books...' }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-5', className)}>
      <style>{`
        @keyframes vp-flip {
          0%, 15%  { transform: rotateY(0deg); }
          85%, 100% { transform: rotateY(-162deg); }
        }
        @keyframes vp-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>

      {/* Book */}
      <div style={{ position: 'relative', width: 96, height: 76, perspective: 600 }}>
        {/* Back cover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'hsl(var(--primary))',
          borderRadius: 6,
          boxShadow: '0 6px 28px rgba(0,0,0,0.22)',
        }} />
        {/* Spine */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 18,
          background: 'hsl(var(--primary) / 0.7)',
          borderRadius: '6px 0 0 6px',
          borderRight: '1px solid rgba(0,0,0,0.12)',
        }} />
        {/* Left page stack (already-read pages) */}
        <div style={{
          position: 'absolute',
          top: 5, bottom: 5, left: 18, right: '52%',
          background: '#fef9f0',
          boxShadow: 'inset -1px 0 3px rgba(0,0,0,0.06)',
        }} />
        {/* Turning pages */}
        {([
          { delay: '0s',    bg: 'linear-gradient(135deg,#fff 0%,#fef3ec 100%)' },
          { delay: '0.28s', bg: 'linear-gradient(135deg,#fff 0%,#fdf0f0 100%)' },
          { delay: '0.56s', bg: 'linear-gradient(135deg,#fff 0%,#f0f0ff 100%)' },
        ] as const).map(({ delay, bg }, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 5, bottom: 5, left: '50%', right: 5,
              transformOrigin: 'left center',
              animation: `vp-flip 2.2s ease-in-out infinite ${delay}`,
              background: bg,
              borderRadius: '0 3px 3px 0',
              border: '0.5px solid rgba(0,0,0,0.07)',
              boxShadow: '2px 0 6px rgba(0,0,0,0.08)',
            }}
          />
        ))}
      </div>

      {/* Label + bouncing dots */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-semibold text-primary">{label}</p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: 6, height: 6,
                borderRadius: '50%',
                background: 'hsl(var(--primary))',
                animation: `vp-bounce 0.9s ease-in-out infinite`,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
