import { useEffect, useState } from 'react'
import { videoService } from '@/services/videoService'
import type { Video } from '@/types'
import VideoCard from '@/components/vaalu-tv/VideoCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'

export default function VaaluTV() {
  const { t } = useLanguage()
  const [videos, setVideos] = useState<Video[]>([])
  const [featured, setFeatured] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    videoService
      .getAll({ limit: 50 })
      .then((res) => {
        const allVideos = res.data || []

        setVideos(allVideos)

        setFeatured(
          allVideos
            .filter((video: any) => video.is_featured === true)
            .slice(0, 3)
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <LoadingSpinner className="py-24" />
  }

  return (
    <div className="container py-8 space-y-10">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{t.vaaluTvPage.title}</h1>

          <a
            href="https://www.youtube.com/@VaaluTV"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
          >
            ▶ YouTube
          </a>
        </div>

        <p className="text-muted-foreground mt-1">
          {t.vaaluTvPage.subtitle}
        </p>
      </div>

      {featured.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {t.vaaluTvPage.featured}
            <Badge className="bg-primary">{t.vaaluTvPage.new}</Badge>
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {featured.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">
          {t.vaaluTvPage.allVideos}
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
            />
          ))}
        </div>
      </section>
    </div>
  )
}