import type { Author } from '@/types'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  authors: Author[]
  activeName: string
  onSelect: (name: string) => void
}

export default function AuthorFilterMenu({ authors, activeName, onSelect }: Props) {
  const { t } = useLanguage()
  const a = t.authors

  if (authors.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-6">
      <button
        onClick={() => onSelect('')}
        className={cn(
          'shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors',
          activeName === ''
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-muted-foreground border-border hover:bg-muted'
        )}
      >
        {a.allAuthors}
      </button>
      {authors.map((author) => (
        <button
          key={author.id}
          onClick={() => onSelect(author.name)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors',
            activeName === author.name
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'
          )}
        >
          {author.name}
        </button>
      ))}
    </div>
  )
}
