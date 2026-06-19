import cover1  from './covers/book-1.svg'
import cover2  from './covers/book-2.svg'
import cover3  from './covers/book-3.svg'
import cover4  from './covers/book-4.svg'
import cover5  from './covers/book-5.svg'
import cover6  from './covers/book-6.svg'
import cover7  from './covers/book-7.svg'
import cover8  from './covers/book-8.svg'
import cover9  from './covers/book-9.svg'
import cover10 from './covers/book-10.svg'

const bookCoverMap: Record<number, string> = {
  1: cover1, 2: cover2, 3: cover3, 4: cover4, 5: cover5,
  6: cover6, 7: cover7, 8: cover8, 9: cover9, 10: cover10,
}

export function getBookCover(id: number, fallback = ''): string {
  return bookCoverMap[id] ?? fallback
}
