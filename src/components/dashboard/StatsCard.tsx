import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; label: string }
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
}

const colorMap = {
  blue:   'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600',
  green:  'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600',
  orange: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600',
  red:    'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600',
  purple: 'bg-gradient-to-br from-violet-50 to-violet-100 text-violet-600',
}

const borderMap = {
  blue: 'border-l-blue-400',
  green: 'border-l-emerald-400',
  orange: 'border-l-amber-400',
  red: 'border-l-rose-400',
  purple: 'border-l-violet-400',
}

export default function StatsCard({ title, value, icon: Icon, trend, color = 'blue' }: Props) {
  return (
    <Card className={cn('border-l-4 transition-shadow hover:shadow-md', borderMap[color])}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <p className={cn('text-xs mt-1 font-medium', trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
                {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className={cn('p-2.5 rounded-lg', colorMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
