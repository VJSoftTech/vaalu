// migrate-books.cjs
// Copies all books from vaalu_db → vaalu (local dev DB).
// Remaps author_id and category_id by matching name/slug.
// Deletes all existing books in vaalu first (clean replace).
// Run: node migrate-books.cjs

const { Pool } = require('pg')

const SRC  = new Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/vaalu_db' })
const DEST = new Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/vaalu' })

async function main() {
  // ── 1. Read source data ────────────────────────────────────
  const { rows: srcBooks }   = await SRC.query('SELECT * FROM books ORDER BY id')
  const { rows: srcAuthors } = await SRC.query('SELECT * FROM authors ORDER BY id')
  const { rows: srcCats }    = await SRC.query('SELECT * FROM categories ORDER BY id')

  console.log(`Source: ${srcBooks.length} books, ${srcAuthors.length} authors, ${srcCats.length} categories`)

  const destClient = await DEST.connect()
  try {
    await destClient.query('BEGIN')

    // ── 2. Delete existing books (reviews CASCADE, order_items SET NULL) ──
    await destClient.query('DELETE FROM books')
    console.log('Cleared existing books in vaalu')

    // ── 3. Ensure all required authors exist in dest (match by name) ──
    const authorMap = {} // srcAuthorId → destAuthorId
    for (const a of srcAuthors) {
      const { rows } = await destClient.query(
        'SELECT id FROM authors WHERE name = $1 LIMIT 1', [a.name]
      )
      if (rows.length > 0) {
        authorMap[a.id] = rows[0].id
      } else {
        const { rows: ins } = await destClient.query(
          `INSERT INTO authors (name, biography, photo, social_links)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [a.name, a.biography || '', a.photo || '', a.social_links || {}]
        )
        authorMap[a.id] = ins[0].id
        console.log(`  Created author "${a.name}" → id ${ins[0].id}`)
      }
    }

    // ── 4. Ensure all required categories exist in dest (match by slug) ──
    const catMap = {} // srcCategoryId → destCategoryId
    for (const c of srcCats) {
      const { rows } = await destClient.query(
        'SELECT id FROM categories WHERE slug = $1 LIMIT 1', [c.slug]
      )
      if (rows.length > 0) {
        catMap[c.id] = rows[0].id
      } else {
        const { rows: ins } = await destClient.query(
          `INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id`,
          [c.name, c.slug]
        )
        catMap[c.id] = ins[0].id
        console.log(`  Created category "${c.name}" (${c.slug}) → id ${ins[0].id}`)
      }
    }

    // ── 5. Insert books with remapped FKs ─────────────────────
    let inserted = 0
    for (const b of srcBooks) {
      const destAuthorId   = b.author_id   ? (authorMap[b.author_id]   ?? null) : null
      const destCategoryId = b.category_id ? (catMap[b.category_id]    ?? null) : null

      await destClient.query(
        `INSERT INTO books
           (title, author_id, category_id, isbn, description, price, discount_price,
            stock_quantity, cover_image, preview_pdf, rating, external_url, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          b.title,
          destAuthorId,
          destCategoryId,
          b.isbn        || null,
          b.description || '',
          b.price,
          b.discount_price || null,
          b.stock_quantity  ?? 0,
          b.cover_image     || '',
          b.preview_pdf     || null,
          b.rating          || 0,
          b.external_url    || '',
          b.created_at      || new Date(),
        ]
      )
      inserted++
      console.log(`  Inserted: ${b.title}`)
    }

    // ── 6. Reset sequence so next INSERT gets a fresh id ──────
    await destClient.query(
      `SELECT setval('books_id_seq', COALESCE((SELECT MAX(id) FROM books), 0) + 1, false)`
    )

    await destClient.query('COMMIT')
    console.log(`\n✅  Migration complete — ${inserted} books copied to vaalu`)
  } catch (e) {
    await destClient.query('ROLLBACK')
    console.error('❌  Migration failed, rolled back:', e.message)
    process.exit(1)
  } finally {
    destClient.release()
    await SRC.end()
    await DEST.end()
  }
}

main()
