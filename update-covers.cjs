require('dotenv').config()
const { Pool } = require('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const covers = [
  ['9789388001001', '/covers/book-1.svg'],
  ['9789388001002', '/covers/book-2.svg'],
  ['9789388001003', '/covers/book-3.svg'],
  ['9789388001004', '/covers/book-4.svg'],
  ['9789388001005', '/covers/book-5.svg'],
  ['9789388001006', '/covers/book-6.svg'],
  ['9789388001007', '/covers/book-7.svg'],
  ['9789388001008', '/covers/book-8.svg'],
  ['9789388001009', '/covers/book-9.svg'],
  ['9789388001010', '/covers/book-10.svg'],
]

;(async () => {
  for (const [isbn, cover] of covers) {
    const { rowCount } = await pool.query(
      'UPDATE books SET cover_image=$1 WHERE isbn=$2',
      [cover, isbn]
    )
    console.log(rowCount ? `✅  ${isbn} → ${cover}` : `⚠️   ${isbn} not found`)
  }
  await pool.end()
})()
