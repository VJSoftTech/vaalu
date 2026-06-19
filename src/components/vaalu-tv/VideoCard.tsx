import { Play, Clock } from 'lucide-react'
import { useState } from 'react'
import type { Video } from '@/types'
import { getYoutubeEmbedUrl } from '@/utils/formatters'
import { Badge } from '@/components/ui/badge'

interface Props {
  video: Video
}

export default function VideoCard({ video }: Props) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="rounded-lg border bg-card overflow-hidden group">
      <div className="relative aspect-video bg-black cursor-pointer" onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe
            src={`${getYoutubeEmbedUrl(video.youtube_id)}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 rounded-full p-3 group-hover:bg-primary transition-colors">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {video.duration}
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          {video.is_featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
          {video.category && <span className="text-xs text-muted-foreground">{video.category}</span>}
        </div>
      </div>
    </div>
  )
}
