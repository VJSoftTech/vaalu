import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Tag, Star, TrendingUp } from 'lucide-react'
import type { GiftItem } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  gift: GiftItem
}

export default function GiftCard({ gift }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image */}
      <Link to={`/gifts/${gift.slug}`} className="block relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-teal-50 to-orange-50">
        {gift.cover_image ? (
          <img
            src={gift.cover_image}
            alt={gift.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎁</div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {gift.is_featured && (
            <Badge className="bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0 h-5 gap-0.5">
              <Star className="h-2.5 w-2.5" /> Featured
            </Badge>
          )}
          {gift.is_trending && (
            <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-5 gap-0.5">
              <TrendingUp className="h-2.5 w-2.5" /> Trending
            </Badge>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1 text-[10px] text-teal-600 font-medium uppercase tracking-wide">
          <Tag className="h-3 w-3" />
          {gift.category}
        </div>

        <Link to={`/gifts/${gift.slug}`} className="block">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-teal-700 transition-colors">
            {gift.title}
          </h3>
        </Link>

        {gift.short_description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{gift.short_description}</p>
        )}

        <div className="flex items-center justify-end pt-1">
          <Link to={`/gifts/${gift.slug}`}>
            <Button
              size="sm"
              className="h-7 text-xs bg-teal-700 hover:bg-teal-800 text-white px-3"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
