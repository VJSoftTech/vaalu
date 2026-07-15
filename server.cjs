// API server with PostgreSQL — run with: node server.cjs
// Requires: npm install pg dotenv
const http = require('http')
const url  = require('url')
const fs   = require('fs')
const path = require('path')
require('dotenv').config()
const { Pool } = require('pg')

// ── Upload directory ──────────────────────────────────────────
const UPLOADS_GIFTS   = path.join(__dirname, 'uploads', 'gifts')
const UPLOADS_BLOGS   = path.join(__dirname, 'uploads', 'blogs')
const UPLOADS_AUTHORS = path.join(__dirname, 'uploads', 'authors')
const UPLOADS_BOOKS   = path.join(__dirname, 'uploads', 'books')
const UPLOADS_BANNERS = path.join(__dirname, 'uploads', 'banners')
const UPLOADS_ANNOUNCEMENTS = path.join(__dirname, 'uploads', 'announcements')
const UPLOADS_PAYMENTS      = path.join(__dirname, 'uploads', 'payments')
fs.mkdirSync(UPLOADS_GIFTS,         { recursive: true })
fs.mkdirSync(UPLOADS_BLOGS,         { recursive: true })
fs.mkdirSync(UPLOADS_AUTHORS,       { recursive: true })
fs.mkdirSync(UPLOADS_BOOKS,         { recursive: true })
fs.mkdirSync(UPLOADS_BANNERS,       { recursive: true })
fs.mkdirSync(UPLOADS_ANNOUNCEMENTS, { recursive: true })
fs.mkdirSync(UPLOADS_PAYMENTS,      { recursive: true })

// ── DB Pool ───────────────────────────────────────────────────
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function q(sql, params = []) {
  const client = await pool.connect()
  try   { return await client.query(sql, params) }
  finally { client.release() }
}

// ── Schema Bootstrap ──────────────────────────────────────────
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) UNIQUE NOT NULL,
      password   VARCHAR(255) NOT NULL,
      role       VARCHAR(50)  DEFAULT 'admin',
      is_active  BOOLEAN      DEFAULT true,
      created_at TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS categories (
      id   SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS authors (
      id           SERIAL PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      biography    TEXT         DEFAULT '',
      photo        VARCHAR(500) DEFAULT '',
      social_links JSONB        DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS books (
      id                SERIAL PRIMARY KEY,
      title             VARCHAR(500) NOT NULL,
      subtitle          VARCHAR(500)  DEFAULT '',
      author_id         INTEGER REFERENCES authors(id) ON DELETE SET NULL,
      category_id       INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      isbn              VARCHAR(50),
      description       TEXT          DEFAULT '',
      price             DECIMAL(10,2) NOT NULL DEFAULT 0,
      discount_price    DECIMAL(10,2),
      stock_quantity    INTEGER       DEFAULT 0,
      cover_image       VARCHAR(500)  DEFAULT '',
      preview_pdf       VARCHAR(500),
      rating            DECIMAL(3,2)  DEFAULT 0,
      external_url      VARCHAR(500)  DEFAULT '',
      publisher         VARCHAR(255)  DEFAULT '',
      total_pages       INTEGER,
      print_type        VARCHAR(20)   DEFAULT '',
      publication_year  INTEGER,
      edition           VARCHAR(100)  DEFAULT '',
      publisher_serial_number VARCHAR(50) DEFAULT '',
      created_at        TIMESTAMPTZ   DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS book_authors (
      id           SERIAL PRIMARY KEY,
      book_id      INTEGER REFERENCES books(id) ON DELETE CASCADE,
      author_id    INTEGER REFERENCES authors(id) ON DELETE CASCADE,
      author_order INTEGER DEFAULT 0,
      UNIQUE(book_id, author_id)
    );
    CREATE TABLE IF NOT EXISTS book_editors (
      id           SERIAL PRIMARY KEY,
      book_id      INTEGER REFERENCES books(id) ON DELETE CASCADE,
      editor_name  VARCHAR(255) NOT NULL,
      editor_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id             SERIAL PRIMARY KEY,
      book_id        INTEGER REFERENCES books(id) ON DELETE CASCADE,
      customer_name  VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) DEFAULT '',
      rating         INTEGER      NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment        TEXT         DEFAULT '',
      created_at     TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS customers (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(255) NOT NULL,
      email         VARCHAR(255) UNIQUE NOT NULL,
      mobile_number VARCHAR(20),
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS orders (
      id              SERIAL PRIMARY KEY,
      customer_id     INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      order_number    VARCHAR(50) UNIQUE NOT NULL,
      subtotal        DECIMAL(10,2) DEFAULT 0,
      gst_amount      DECIMAL(10,2) DEFAULT 0,
      shipping_amount DECIMAL(10,2) DEFAULT 0,
      total_amount    DECIMAL(10,2) DEFAULT 0,
      payment_status  VARCHAR(50) DEFAULT 'pending',
      order_status    VARCHAR(50) DEFAULT 'pending',
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id         SERIAL PRIMARY KEY,
      order_id   INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      book_id    INTEGER REFERENCES books(id) ON DELETE SET NULL,
      quantity   INTEGER       NOT NULL DEFAULT 1,
      unit_price DECIMAL(10,2) NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS blogs (
      id             SERIAL PRIMARY KEY,
      title          VARCHAR(500) NOT NULL,
      slug           VARCHAR(500) UNIQUE NOT NULL,
      content        TEXT         DEFAULT '',
      featured_image VARCHAR(500) DEFAULT '',
      author_id      INTEGER REFERENCES authors(id) ON DELETE SET NULL,
      published_at   TIMESTAMPTZ  DEFAULT NOW(),
      created_at     TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS videos (
      id          SERIAL PRIMARY KEY,
      youtube_id  VARCHAR(50)  NOT NULL,
      title       VARCHAR(500) NOT NULL,
      thumbnail   VARCHAR(500) DEFAULT '',
      duration    VARCHAR(20)  DEFAULT '',
      is_featured BOOLEAN      DEFAULT false,
      created_at  TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS advertisements (
      id           SERIAL PRIMARY KEY,
      title        VARCHAR(500) NOT NULL,
      banner_image VARCHAR(500) DEFAULT '',
      redirect_url VARCHAR(500) DEFAULT '',
      start_date   DATE,
      end_date     DATE,
      is_active    BOOLEAN     DEFAULT true,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS gift_items (
      id                SERIAL PRIMARY KEY,
      title             VARCHAR(255) NOT NULL,
      slug              VARCHAR(255) UNIQUE NOT NULL,
      short_description TEXT         DEFAULT '',
      description       TEXT         DEFAULT '',
      price             DECIMAL(10,2) NOT NULL DEFAULT 0,
      offer_price       DECIMAL(10,2),
      category          VARCHAR(100)  DEFAULT 'Gift Currency Notes',
      cover_image       TEXT          DEFAULT '',
      gallery           JSONB         DEFAULT '[]',
      video_url         TEXT          DEFAULT '',
      is_featured       BOOLEAN       DEFAULT false,
      is_trending       BOOLEAN       DEFAULT false,
      is_active         BOOLEAN       DEFAULT true,
      display_order     INTEGER       DEFAULT 0,
      created_at        TIMESTAMPTZ   DEFAULT NOW(),
      updated_at        TIMESTAMPTZ   DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS gift_enquiries (
      id            SERIAL PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      phone_number  VARCHAR(20)  DEFAULT '',
      email         VARCHAR(255) DEFAULT '',
      gift_id       INTEGER REFERENCES gift_items(id) ON DELETE SET NULL,
      message       TEXT         DEFAULT '',
      status        VARCHAR(50)  DEFAULT 'new',
      created_at    TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS book_donations (
      id                 SERIAL PRIMARY KEY,
      name               VARCHAR(255) NOT NULL,
      email              VARCHAR(255) DEFAULT '',
      phone_number       VARCHAR(20)  DEFAULT '',
      best_time_to_call  VARCHAR(50)  DEFAULT '',
      comments           TEXT         DEFAULT '',
      status             VARCHAR(50)  DEFAULT 'new',
      created_at         TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS corporate_enquiries (
      id                   SERIAL PRIMARY KEY,
      company_name         VARCHAR(255) NOT NULL,
      contact_person_name  VARCHAR(255) NOT NULL,
      email                VARCHAR(255) DEFAULT '',
      phone_number         VARCHAR(20)  NOT NULL,
      best_time_to_call    VARCHAR(50)  DEFAULT '',
      enquiry_type         VARCHAR(50)  DEFAULT 'Bulk Order',
      comments             TEXT         DEFAULT '',
      status               VARCHAR(50)  DEFAULT 'new',
      created_at           TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS copyright_enquiries (
      id              SERIAL PRIMARY KEY,
      applicant_name  VARCHAR(255) NOT NULL,
      email           VARCHAR(255) NOT NULL,
      phone_number    VARCHAR(20)  NOT NULL,
      book_id         INTEGER REFERENCES books(id) ON DELETE SET NULL,
      enquiry_type    VARCHAR(50)  DEFAULT 'Other',
      comments        TEXT         DEFAULT '',
      status          VARCHAR(50)  DEFAULT 'new',
      created_at      TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS announcements (
      id           SERIAL PRIMARY KEY,
      title        VARCHAR(500) NOT NULL,
      message      TEXT         NOT NULL,
      image        VARCHAR(500) DEFAULT '',
      link_url     VARCHAR(500) DEFAULT '',
      priority     VARCHAR(20)  DEFAULT 'normal',
      is_active    BOOLEAN      DEFAULT true,
      start_date   DATE,
      end_date     DATE,
      created_at   TIMESTAMPTZ  DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS announcement_reads (
      id              SERIAL PRIMARY KEY,
      announcement_id INTEGER REFERENCES announcements(id) ON DELETE CASCADE,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      read_at         TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(announcement_id, user_id)
    );
  `)

  // One-time cleanup of the earlier unshipped visitor-tracking scaffold
  await pool.query(`DROP TABLE IF EXISTS visitors;`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS visitor_logs (
      id               SERIAL PRIMARY KEY,
      session_id       VARCHAR(64)  NOT NULL,
      user_id          INTEGER      REFERENCES users(id) ON DELETE SET NULL,
      user_name        VARCHAR(255) NOT NULL,
      email            VARCHAR(255) NOT NULL,
      page_name        VARCHAR(255) NOT NULL,
      page_url         VARCHAR(500) NOT NULL,
      device_type      VARCHAR(20)  DEFAULT 'desktop',
      browser          VARCHAR(50)  DEFAULT 'Unknown',
      operating_system VARCHAR(50)  DEFAULT 'Unknown',
      ip_address       VARCHAR(64)  DEFAULT '',
      visit_date_time  TIMESTAMPTZ  DEFAULT NOW(),
      last_activity    TIMESTAMPTZ  DEFAULT NOW(),
      logged_out_at    TIMESTAMPTZ
    );
    CREATE INDEX IF NOT EXISTS idx_visitor_logs_session    ON visitor_logs(session_id);
    CREATE INDEX IF NOT EXISTS idx_visitor_logs_visit_time ON visitor_logs(visit_date_time DESC);
    CREATE INDEX IF NOT EXISTS idx_visitor_logs_user       ON visitor_logs(user_id);
  `)

  // Schema migrations: add columns that may be missing from tables created by older schemas
  await pool.query(`
    ALTER TABLE gift_items ADD COLUMN IF NOT EXISTS price        DECIMAL(10,2) NOT NULL DEFAULT 0;
    ALTER TABLE gift_items ADD COLUMN IF NOT EXISTS offer_price  DECIMAL(10,2);
    ALTER TABLE gift_items ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMPTZ   DEFAULT NOW();
    ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS type          VARCHAR(50)  DEFAULT 'banner';
    ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS display_order INTEGER      DEFAULT 0;
    ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS subtitle      VARCHAR(500) DEFAULT '';
    ALTER TABLE books ADD COLUMN IF NOT EXISTS external_url VARCHAR(500) DEFAULT '';
    ALTER TABLE books ADD COLUMN IF NOT EXISTS subtitle         VARCHAR(500) DEFAULT '';
    ALTER TABLE books ADD COLUMN IF NOT EXISTS publisher        VARCHAR(255) DEFAULT '';
    ALTER TABLE books ADD COLUMN IF NOT EXISTS total_pages      INTEGER;
    ALTER TABLE books ADD COLUMN IF NOT EXISTS print_type       VARCHAR(20)  DEFAULT '';
    ALTER TABLE books ADD COLUMN IF NOT EXISTS publication_year INTEGER;
    ALTER TABLE books ADD COLUMN IF NOT EXISTS edition          VARCHAR(100) DEFAULT '';
    ALTER TABLE books ADD COLUMN IF NOT EXISTS publisher_serial_number VARCHAR(50) DEFAULT '';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method     VARCHAR(50)  DEFAULT 'qr';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_ref_id     VARCHAR(255) DEFAULT '';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_attachment VARCHAR(500) DEFAULT '';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address   JSONB        DEFAULT '{}';
  `)

  // Seed default admin
  await pool.query(`
    INSERT INTO users (name, email, password, role)
    VALUES ('Admin User', 'admin@vaalu.com', 'admin123', 'admin')
    ON CONFLICT (email) DO NOTHING
  `)

  // Seed categories
  await pool.query(`
    INSERT INTO categories (name, slug) VALUES
      ('சிறுவர் இலக்கியம்',    'siruvar-ilakkiyam'),
      ('கவிதை',                'kavithai'),
      ('வரலாறு & நிகழ்வுகள்', 'varalaru-nigalvugal'),
      ('மருத்துவம்',            'maruthuvam'),
      ('பொது அறிவு',           'pothu-arivu')
    ON CONFLICT (slug) DO NOTHING
  `)

  // Seed authors (only if table is empty)
  const { rows: [{ count: ac }] } = await pool.query('SELECT COUNT(*) FROM authors')
  if (parseInt(ac) === 0) {
    await pool.query(`
      INSERT INTO authors (name, biography, photo, social_links) VALUES
        ('வாலு பதிப்பகம்',      'வாலு பதிப்பகம் தமிழ் இலக்கியத்தை ஊக்குவிக்கும் ஒரு முன்னணி வெளியீட்டு நிறுவனம்.', '', '{}'),
        ('பல்வேறு ஆசிரியர்கள்', 'பல்வேறு தமிழ் எழுத்தாளர்களால் இயற்றப்பட்ட படைப்புகள்.',                              '', '{}')
    `)
  }

  // Seed books (only if table is empty)
  const { rows: [{ count: bc }] } = await pool.query('SELECT COUNT(*) FROM books')
  if (parseInt(bc) === 0) {
    const { rows: cats }    = await pool.query('SELECT id, slug FROM categories')
    const { rows: authors } = await pool.query("SELECT id FROM authors WHERE name='வாலு பதிப்பகம்' LIMIT 1")
    const catMap   = Object.fromEntries(cats.map(c => [c.slug, c.id]))
    const authorId = authors[0]?.id

    const seedBooks = [
      { title: 'குட்டி தவளை கோபாரு - சிறுவர் பாடல்கள்',         cat: 'siruvar-ilakkiyam', isbn: '9789388001001', desc: 'குழந்தைகளுக்கான அழகிய சிறுவர் பாடல்கள் தொகுப்பு.',                          price: 120, disc: 100,  stock: 50,  rating: 4.5, cover: '/covers/book-1.svg' },
      { title: 'காலை வணக்கம் காதல் கவிதைகள்',                    cat: 'kavithai',          isbn: '9789388001002', desc: 'காலை வேளையில் மனதை மகிழ்விக்கும் காதல் கவிதைகள்.',                           price: 150, disc: 130,  stock: 40,  rating: 4.6, cover: '/covers/book-2.svg' },
      { title: 'கோவை பேரியார் அறிவுலக நூலகத்தில்',              cat: 'varalaru-nigalvugal',isbn: '9789388001003', desc: 'கோவை பேரியார் அறிவுலக நூலகத்தில் நடைபெற்ட நிகழ்வுகளின் தொகுப்பு.',      price: 180, disc: 160,  stock: 30,  rating: 4.4, cover: '/covers/book-3.svg' },
      { title: '2026 சென்னை சர்வதேசப் புத்தகக்காட்சியில் வாரு', cat: 'varalaru-nigalvugal',isbn: '9789388001004', desc: '2026 சென்னை சர்வதேசப் புத்தகக்காட்சி பற்றிய தகவல் தொகுப்பு.',           price: 100, disc: null, stock: 100, rating: 4.3, cover: '/covers/book-4.svg' },
      { title: 'சென்னை சர்வதேசப் புத்தகக்காட்சியில் 12',        cat: 'varalaru-nigalvugal',isbn: '9789388001005', desc: 'சென்னை சர்வதேசப் புத்தகக்காட்சியில் வாலு பதிப்பகத்தின் 12 ஆண்டு நிறைவு.', price: 100, disc: null, stock: 100, rating: 4.3, cover: '/covers/book-5.svg' },
      { title: 'தங்கமே எனக்கே செல்லிரோய் - கவிதை',              cat: 'kavithai',          isbn: '9789388001006', desc: 'அன்பு மொழிகளால் நெஞ்சை நெகிழ்விக்கும் காதல் கவிதைகள்.',                  price: 150, disc: 130,  stock: 45,  rating: 4.7, cover: '/covers/book-6.svg' },
      { title: 'வாழ்வில் பொருள் - பொது அறிவு கேள்வி',           cat: 'pothu-arivu',       isbn: '9789388001007', desc: 'வாழ்வில் பொருளான கேள்விகளும் அறிவார்ந்த விடைகளும்.',                       price: 200, disc: 175,  stock: 35,  rating: 4.5, cover: '/covers/book-7.svg' },
      { title: 'விடக்கேற்று விளைகள் - கவிதை தொகுப்பு',          cat: 'kavithai',          isbn: '9789388001008', desc: 'சமகால தமிழ்க் கவிதைகளின் சிறந்த தொகுப்பு.',                               price: 160, disc: 140,  stock: 40,  rating: 4.4, cover: '/covers/book-8.svg' },
      { title: 'பேரன் நந்தும் பேரதோக் காப்பு',                   cat: 'siruvar-ilakkiyam', isbn: '9789388001009', desc: 'பாட்டன் பேரன் உறவின் அழகை சித்தரிக்கும் இனிய நூல்.',                        price: 130, disc: 110,  stock: 55,  rating: 4.6, cover: '/covers/book-9.svg' },
      { title: 'எளிய சித்த மருத்துவம் குறிப்புகள்',              cat: 'maruthuvam',        isbn: '9789388001010', desc: 'வீட்டிலேயே கடைபிடிக்கக்கூடிய எளிய சித்த மருத்துவ குறிப்புகள்.',      price: 220, disc: 190,  stock: 60,  rating: 4.8, cover: '/covers/book-10.svg' },
    ]
    for (const b of seedBooks) {
      await pool.query(
        `INSERT INTO books (title, author_id, category_id, isbn, description, price, discount_price, stock_quantity, rating, cover_image)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [b.title, authorId, catMap[b.cat], b.isbn, b.desc, b.price, b.disc, b.stock, b.rating, b.cover]
      )
    }
  }

  // Apply cover images to existing rows that still have a blank cover_image
  const coverMap = {
    '9789388001001': '/covers/book-1.svg',
    '9789388001002': '/covers/book-2.svg',
    '9789388001003': '/covers/book-3.svg',
    '9789388001004': '/covers/book-4.svg',
    '9789388001005': '/covers/book-5.svg',
    '9789388001006': '/covers/book-6.svg',
    '9789388001007': '/covers/book-7.svg',
    '9789388001008': '/covers/book-8.svg',
    '9789388001009': '/covers/book-9.svg',
    '9789388001010': '/covers/book-10.svg',
  }
  for (const [isbn, cover] of Object.entries(coverMap)) {
    await pool.query(
      `UPDATE books SET cover_image=$1 WHERE isbn=$2 AND (cover_image IS NULL OR cover_image='')`,
      [cover, isbn]
    )
  }

  console.log('✅  Database ready')
}

// ── HTTP Helpers ──────────────────────────────────────────────
function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}
function ok(res, data)        { send(res, 200, data) }
function created(res, d)      { send(res, 201, d) }
function notFound(res)        { send(res, 404, { message: 'Not found' }) }
function badRequest(res, msg) { send(res, 400, { message: msg }) }
function conflict(res, msg)   { send(res, 409, { message: msg }) }
function serverErr(res, e)    { console.error(e); send(res, 500, { message: 'Server error' }) }

function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', c => { body += c })
    req.on('end', () => {
      const ct = req.headers['content-type'] || ''
      if (ct.includes('multipart/form-data')) { resolve({}); return }
      try { resolve(JSON.parse(body || '{}')) } catch { resolve({}) }
    })
  })
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const ct = req.headers['content-type'] || ''
    const bm = ct.match(/boundary=([^\s;]+)/)
    if (!bm) { resolve({ fields: {}, files: {} }); return }
    const boundary = bm[1].trim()
    const bufs = []
    req.on('data', c => bufs.push(c))
    req.on('error', reject)
    req.on('end', () => {
      try {
        const buf    = Buffer.concat(bufs)
        const sep    = Buffer.from('\r\n--' + boundary)
        const fields = {}
        const files  = {}
        const startMark = Buffer.from('--' + boundary + '\r\n')
        let pos = buf.indexOf(startMark)
        if (pos === -1) { resolve({ fields, files }); return }
        pos += startMark.length

        while (pos < buf.length) {
          const CRLF2  = Buffer.from('\r\n\r\n')
          const hdrEnd = buf.indexOf(CRLF2, pos)
          if (hdrEnd === -1) break
          const headers   = buf.slice(pos, hdrEnd).toString()
          const bodyStart = hdrEnd + 4
          const nextSep   = buf.indexOf(sep, bodyStart)
          const bodyEnd   = nextSep === -1 ? buf.length : nextSep
          const body      = buf.slice(bodyStart, bodyEnd)

          const nameM = headers.match(/name="([^"]+)"/)
          const fileM = headers.match(/filename="([^"]*)"/)
          if (nameM) {
            if (fileM && fileM[1]) {
              const ctM = headers.match(/Content-Type:\s*(\S+)/i)
              files[nameM[1]] = { filename: fileM[1], data: body, contentType: ctM ? ctM[1] : 'image/jpeg' }
            } else {
              fields[nameM[1]] = body.toString()
            }
          }
          if (nextSep === -1) break
          pos = nextSep + sep.length
          if (buf[pos] === 45 && buf[pos + 1] === 45) break // '--' final boundary
          pos += 2 // skip '\r\n'
        }
        resolve({ fields, files })
      } catch (e) { reject(e) }
    })
  })
}

async function saveGiftImage(file) {
  if (!file || !file.filename || !file.data || file.data.length === 0) return ''
  const ext  = path.extname(file.filename) || '.jpg'
  const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
  const dest = path.join(UPLOADS_GIFTS, name)
  fs.writeFileSync(dest, file.data)
  return '/uploads/gifts/' + name
}

async function saveBlogImage(file) {
  if (!file || !file.filename || !file.data || file.data.length === 0) return ''
  const ext  = path.extname(file.filename) || '.jpg'
  const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
  const dest = path.join(UPLOADS_BLOGS, name)
  fs.writeFileSync(dest, file.data)
  return '/uploads/blogs/' + name
}

async function saveAuthorPhoto(file) {
  if (!file || !file.filename || !file.data || file.data.length === 0) return ''
  const ext  = path.extname(file.filename) || '.jpg'
  const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
  const dest = path.join(UPLOADS_AUTHORS, name)
  fs.writeFileSync(dest, file.data)
  return '/uploads/authors/' + name
}

async function saveBookCover(file) {
  if (!file || !file.filename || !file.data || file.data.length === 0) return ''
  const ext  = path.extname(file.filename) || '.jpg'
  const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
  const dest = path.join(UPLOADS_BOOKS, name)
  fs.writeFileSync(dest, file.data)
  return '/uploads/books/' + name
}

async function saveBannerImage(file) {
  if (!file || !file.filename || !file.data || file.data.length === 0) return ''
  const ext  = path.extname(file.filename) || '.jpg'
  const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
  const dest = path.join(UPLOADS_BANNERS, name)
  fs.writeFileSync(dest, file.data)
  return '/uploads/banners/' + name
}

async function saveAnnouncementImage(file) {
  if (!file || !file.filename || !file.data || file.data.length === 0) return ''
  const ext  = path.extname(file.filename) || '.jpg'
  const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
  const dest = path.join(UPLOADS_ANNOUNCEMENTS, name)
  fs.writeFileSync(dest, file.data)
  return '/uploads/announcements/' + name
}

async function savePaymentAttachment(file) {
  if (!file || !file.filename || !file.data || file.data.length === 0) return ''
  const ext  = path.extname(file.filename) || '.jpg'
  const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
  const dest = path.join(UPLOADS_PAYMENTS, name)
  fs.writeFileSync(dest, file.data)
  return '/uploads/payments/' + name
}

const BOOK_JOIN = `
  SELECT b.*, a.name AS author_name, c.name AS category_name,
    COALESCE(
      (SELECT json_agg(json_build_object('id', ba.author_id, 'name', au.name) ORDER BY ba.author_order)
       FROM book_authors ba JOIN authors au ON au.id = ba.author_id
       WHERE ba.book_id = b.id),
      '[]'
    ) AS authors,
    COALESCE(
      (SELECT json_agg(json_build_object('name', be.editor_name) ORDER BY be.editor_order)
       FROM book_editors be
       WHERE be.book_id = b.id),
      '[]'
    ) AS editors
  FROM books b
  LEFT JOIN authors    a ON b.author_id    = a.id
  LEFT JOIN categories c ON b.category_id  = c.id
`

async function syncBookAuthors(bookId, primaryAuthorId, coAuthorIds) {
  const ordered = []
  if (primaryAuthorId) ordered.push(primaryAuthorId)
  for (const id of coAuthorIds) {
    if (id && !ordered.includes(id)) ordered.push(id)
  }
  const capped = ordered.slice(0, 10)
  await q('DELETE FROM book_authors WHERE book_id=$1', [bookId])
  for (let i = 0; i < capped.length; i++) {
    await q(
      'INSERT INTO book_authors (book_id, author_id, author_order) VALUES ($1,$2,$3) ON CONFLICT (book_id, author_id) DO NOTHING',
      [bookId, capped[i], i]
    )
  }
}

function parseCoAuthorIds(field) {
  return (field || '')
    .split(',')
    .map((s) => parseInt(s.trim()))
    .filter((n) => Number.isInteger(n) && n > 0)
}

async function syncBookEditors(bookId, editorNames) {
  const names = editorNames.filter((n) => n && n.trim()).slice(0, 10)
  await q('DELETE FROM book_editors WHERE book_id=$1', [bookId])
  for (let i = 0; i < names.length; i++) {
    await q(
      'INSERT INTO book_editors (book_id, editor_name, editor_order) VALUES ($1,$2,$3)',
      [bookId, names[i].trim(), i]
    )
  }
}

function parseEditorNames(field) {
  return (field || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

async function findDuplicateBookTitle(title, excludeId) {
  const { rows } = await q(
    'SELECT id FROM books WHERE LOWER(TRIM(title)) = LOWER(TRIM($1)) AND ($2::int IS NULL OR id <> $2) LIMIT 1',
    [title, excludeId]
  )
  return rows[0] || null
}

// ── Visitor tracking helpers ─────────────────────────────────
const VISITOR_OFFLINE_THRESHOLD_MINUTES = parseInt(process.env.VISITOR_OFFLINE_THRESHOLD_MINUTES || '2', 10)

// Note: a User-Agent string cannot reliably distinguish a laptop from a desktop —
// both are bucketed as 'desktop' here.
function parseUserAgent(ua) {
  ua = ua || ''
  let device_type = 'desktop'
  if (/ipad|tablet(?!.*mobile)|(android(?!.*mobile))/i.test(ua)) device_type = 'tablet'
  else if (/mobile|iphone|ipod|android/i.test(ua)) device_type = 'mobile'

  let operating_system = 'Unknown'
  if (/windows/i.test(ua)) operating_system = 'Windows'
  else if (/iphone|ipad|ipod/i.test(ua)) operating_system = 'iOS'
  else if (/android/i.test(ua)) operating_system = 'Android'
  else if (/mac os x|macintosh/i.test(ua)) operating_system = 'macOS'
  else if (/linux/i.test(ua)) operating_system = 'Linux'

  let browser = 'Other'
  if (/edg\//i.test(ua)) browser = 'Edge'
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera'
  else if (/chrome\//i.test(ua)) browser = 'Chrome'
  else if (/firefox\//i.test(ua)) browser = 'Firefox'
  else if (/safari\//i.test(ua)) browser = 'Safari'

  return { device_type, browser, operating_system }
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (fwd) return fwd.split(',')[0].trim()
  return (req.socket && req.socket.remoteAddress) || ''
}

// Maps route patterns to human-readable page names so dynamic routes
// (e.g. /books/42) collapse into one bucket for "Most Visited Pages" aggregation.
const PAGE_LABEL_RULES = [
  [/^\/$/, 'Home'],
  [/^\/books\/[^/]+$/, 'Book Detail'],
  [/^\/books/, 'Books'],
  [/^\/authors\/[^/]+$/, 'Author Detail'],
  [/^\/authors/, 'Authors'],
  [/^\/blog\/[^/]+$/, 'Blog Detail'],
  [/^\/blog/, 'Blog'],
  [/^\/reviews/, 'Reviews'],
  [/^\/vaalu-tv/, 'Vaalu TV'],
  [/^\/gifts\/[^/]+$/, 'Gift Detail'],
  [/^\/gifts/, 'Gifts'],
  [/^\/donate-books/, 'Donate Books'],
  [/^\/corporate-enquiries/, 'Corporate Enquiries'],
  [/^\/copyright-enquiries/, 'Copyright Enquiries'],
  [/^\/offers/, 'Offers'],
  [/^\/about/, 'About Us'],
  [/^\/publish-plan/, 'Publish Plan'],
  [/^\/contact/, 'Contact Us'],
  [/^\/cart/, 'Cart'],
  [/^\/checkout/, 'Checkout'],
  [/^\/order-confirmation/, 'Order Confirmation'],
  [/^\/profile/, 'Profile'],
  [/^\/orders/, 'Order History'],
  [/^\/wishlist/, 'Wishlist'],
  [/^\/announcements/, 'Announcements'],
]
function getPageLabel(pathname) {
  for (const [pattern, label] of PAGE_LABEL_RULES) {
    if (pattern.test(pathname)) return label
  }
  return pathname
}

const wsClients = new Set()
function broadcast(type, payload) {
  const msg = JSON.stringify({ type, payload })
  for (const client of wsClients) {
    if (client.readyState === 1 /* OPEN */) {
      try { client.send(msg) } catch { /* ignore dead socket */ }
    }
  }
}

async function computeVisitorStats() {
  const { rows: [stats] } = await q(
    `WITH session_agg AS (
       SELECT session_id, MAX(user_id) AS user_id,
              MAX(last_activity) AS last_activity_at,
              MAX(logged_out_at) AS logged_out_at
       FROM visitor_logs GROUP BY session_id
     )
     SELECT
       (SELECT COUNT(DISTINCT user_id) FROM visitor_logs WHERE visit_date_time >= date_trunc('day', NOW()))::int AS "totalVisitorsToday",
       (SELECT COUNT(DISTINCT user_id) FROM session_agg
          WHERE logged_out_at IS NULL AND last_activity_at > NOW() - ($1 || ' minutes')::interval)::int AS "currentOnlineUsers",
       (SELECT COUNT(*) FROM visitor_logs WHERE visit_date_time >= date_trunc('day', NOW()))::int AS "totalPageVisitsToday",
       (SELECT COUNT(DISTINCT user_id) FROM visitor_logs WHERE visit_date_time >= date_trunc('day', NOW()))::int AS "uniqueVisitorsToday"
    `,
    [VISITOR_OFFLINE_THRESHOLD_MINUTES]
  )
  const { rows: mostVisited } = await q(
    `SELECT page_name, COUNT(*)::int AS count
     FROM visitor_logs
     WHERE visit_date_time >= date_trunc('day', NOW())
     GROUP BY page_name ORDER BY count DESC LIMIT 5`
  )
  return { ...stats, mostVisitedPages: mostVisited }
}

// ── Routing ───────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  const parsed   = url.parse(req.url, true)
  const pathname = parsed.pathname
  const params   = new URLSearchParams(parsed.query)
  const method   = req.method

  try {
    // ── Static uploads ────────────────────────────────────────
    if (pathname.startsWith('/uploads/') && method === 'GET') {
      const filePath = path.join(__dirname, pathname)
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase()
        const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' }
        res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' })
        fs.createReadStream(filePath).pipe(res)
        return
      }
      notFound(res); return
    }

    // ── Auth ──────────────────────────────────────────────────
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req)
      const { rows } = await q(
        'SELECT * FROM users WHERE email=$1 AND password=$2 AND is_active=true',
        [body.email, body.password]
      )
      if (!rows.length) return badRequest(res, 'Invalid credentials')
      const u = rows[0]
      return ok(res, { token: 'mock-jwt-token', user: { id: u.id, name: u.name, email: u.email, role: u.role } })
    }

    if (pathname === '/api/auth/profile' && method === 'GET') {
      const { rows } = await q('SELECT id, name, email, role, is_active FROM users LIMIT 1')
      return ok(res, rows[0] || {})
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      return ok(res, { message: 'Logged out' })
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseBody(req)
      const { name, email, mobile_number, password } = body
      if (!name || !email || !password) return badRequest(res, 'Name, email and password are required')
      const existing = await q('SELECT id FROM users WHERE email=$1', [email])
      if (existing.rows.length) return badRequest(res, 'Email already registered')
      const { rows } = await q(
        'INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role',
        [name, email, password, 'customer']
      )
      // Also create customer profile record
      await q(
        'INSERT INTO customers (name, email, mobile_number) VALUES ($1,$2,$3) ON CONFLICT (email) DO NOTHING',
        [name, email, mobile_number || null]
      )
      return created(res, { user: rows[0] })
    }

    // ── Users (admin/staff management) ───────────────────────
    if (pathname === '/api/users' && method === 'GET') {
      const { rows } = await q(
        `SELECT id, name, email, role, is_active, created_at FROM users
         WHERE role IN ('admin','staff') ORDER BY created_at DESC`
      )
      return ok(res, { data: rows, total: rows.length })
    }

    if (pathname === '/api/users' && method === 'POST') {
      const body = await parseBody(req)
      const { name, email, password, role = 'staff' } = body
      if (!name || !email || !password) return badRequest(res, 'Name, email and password are required')
      if (!['admin', 'staff'].includes(role)) return badRequest(res, 'Role must be admin or staff')
      const existing = await q('SELECT id FROM users WHERE email=$1', [email])
      if (existing.rows.length) return badRequest(res, 'Email already registered')
      const { rows } = await q(
        'INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role, is_active, created_at',
        [name, email, password, role]
      )
      return created(res, rows[0])
    }

    const userMatch = pathname.match(/^\/api\/users\/(\d+)$/)
    if (userMatch) {
      const id = parseInt(userMatch[1])
      if (method === 'PUT') {
        const body = await parseBody(req)
        const cur = (await q('SELECT * FROM users WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const name      = body.name      ?? cur.name
        const email     = body.email     ?? cur.email
        const role      = body.role      ?? cur.role
        const is_active = body.is_active !== undefined ? body.is_active : cur.is_active
        const password  = body.password  ? body.password : cur.password
        const { rows } = await q(
          `UPDATE users SET name=$1, email=$2, password=$3, role=$4, is_active=$5
           WHERE id=$6 RETURNING id, name, email, role, is_active, created_at`,
          [name, email, password, role, is_active, id]
        )
        return ok(res, rows[0])
      }
      if (method === 'DELETE') {
        await q('DELETE FROM users WHERE id=$1', [id])
        return ok(res, { message: 'Deleted' })
      }
    }

    // ── Categories ────────────────────────────────────────────
    if (pathname === '/api/categories' && method === 'GET') {
      const { rows } = await q('SELECT * FROM categories ORDER BY id')
      return ok(res, rows)
    }

    if (pathname === '/api/categories' && method === 'POST') {
      const body = await parseBody(req)
      if (!body.name) return badRequest(res, 'Name is required')
      const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-')
      const { rows } = await q(
        'INSERT INTO categories (name, slug) VALUES ($1,$2) RETURNING *',
        [body.name, slug]
      )
      return created(res, rows[0])
    }

    const catMatch = pathname.match(/^\/api\/categories\/(\d+)$/)
    if (catMatch) {
      const id = parseInt(catMatch[1])
      if (method === 'PUT') {
        const body = await parseBody(req)
        const cur = (await q('SELECT * FROM categories WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const { rows } = await q(
          'UPDATE categories SET name=$1, slug=$2 WHERE id=$3 RETURNING *',
          [body.name ?? cur.name, body.slug ?? cur.slug, id]
        )
        return ok(res, rows[0])
      }
      if (method === 'DELETE') {
        await q('DELETE FROM categories WHERE id=$1', [id])
        return ok(res, { message: 'Deleted' })
      }
    }

    // ── Authors ───────────────────────────────────────────────
    if (pathname === '/api/authors' && method === 'GET') {
      const search = params.get('search') || ''
      const limit  = Math.max(1, parseInt(params.get('limit') || '50'))
      const page   = Math.max(1, parseInt(params.get('page')  || '1'))
      const offset = (page - 1) * limit

      const [countRes, dataRes] = await Promise.all([
        q(`SELECT COUNT(*) FROM authors WHERE ($1='' OR name ILIKE '%'||$1||'%')`, [search]),
        q(`SELECT a.*, COUNT(b.id)::int AS books_count
           FROM authors a LEFT JOIN books b ON b.author_id=a.id
           WHERE ($1='' OR a.name ILIKE '%'||$1||'%')
           GROUP BY a.id ORDER BY a.id LIMIT $2 OFFSET $3`, [search, limit, offset]),
      ])
      const total = parseInt(countRes.rows[0].count)
      return ok(res, { data: dataRes.rows, total, page, limit, total_pages: Math.ceil(total / limit) })
    }

    if (pathname === '/api/authors' && method === 'POST') {
      const { fields, files } = await parseMultipart(req)
      const { name, biography = '', social_links = '{}' } = fields
      if (!name) return badRequest(res, 'Name is required')
      const photo = await saveAuthorPhoto(files.photo)
      let parsedLinks = {}
      try { parsedLinks = JSON.parse(social_links) } catch { parsedLinks = {} }
      const { rows } = await q(
        'INSERT INTO authors (name, biography, photo, social_links) VALUES ($1,$2,$3,$4) RETURNING *',
        [name, biography, photo, JSON.stringify(parsedLinks)]
      )
      return created(res, { ...rows[0], books_count: 0 })
    }

    const authorMatch = pathname.match(/^\/api\/authors\/(\d+)$/)
    if (authorMatch) {
      const id = parseInt(authorMatch[1])
      if (method === 'GET') {
        const { rows } = await q(
          `SELECT a.*, COUNT(b.id)::int AS books_count
           FROM authors a LEFT JOIN books b ON b.author_id=a.id
           WHERE a.id=$1 GROUP BY a.id`, [id]
        )
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
      if (method === 'PUT') {
        const { fields, files } = await parseMultipart(req)
        const cur  = (await q('SELECT * FROM authors WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const newPhoto = await saveAuthorPhoto(files.photo)
        let parsedLinks = cur.social_links
        if (fields.social_links) {
          try { parsedLinks = JSON.parse(fields.social_links) } catch { parsedLinks = cur.social_links }
        }
        const { rows } = await q(
          'UPDATE authors SET name=$1, biography=$2, photo=$3, social_links=$4 WHERE id=$5 RETURNING *',
          [fields.name??cur.name, fields.biography??cur.biography, newPhoto||cur.photo, JSON.stringify(parsedLinks), id]
        )
        return ok(res, rows[0])
      }
      if (method === 'DELETE') {
        await q('DELETE FROM authors WHERE id=$1', [id])
        return ok(res, { message: 'Deleted' })
      }
    }

    // ── Books ─────────────────────────────────────────────────
    if (pathname === '/api/books' && method === 'GET') {
      const search = params.get('search')     || ''
      const catId  = params.get('category_id') ? parseInt(params.get('category_id')) : null
      const authId = params.get('author_id')   ? parseInt(params.get('author_id'))   : null
      const page   = Math.max(1, parseInt(params.get('page')  || '1'))
      // No `limit` param means "return every matching book" — pagination is opt-in,
      // not the default, so admin/report views never silently truncate results.
      const limitParam = params.get('limit')
      const hasLimit = limitParam !== null && limitParam !== ''
      const limit  = hasLimit ? Math.max(1, parseInt(limitParam)) : null
      const offset = hasLimit ? (page - 1) * limit : 0

      const ALLOWED_SORT = new Set(['created_at', 'price', 'rating', 'title', 'stock_quantity'])
      const sortBy    = ALLOWED_SORT.has(params.get('sort_by')) ? params.get('sort_by') : 'created_at'
      const sortOrder = params.get('sort_order') === 'asc' ? 'ASC' : 'DESC'

      const minPrice = params.get('min_price') ? parseFloat(params.get('min_price')) : null
      const maxPrice = params.get('max_price') ? parseFloat(params.get('max_price')) : null

      const where  = `WHERE ($1='' OR b.title ILIKE '%'||$1||'%') AND ($2::int IS NULL OR b.category_id=$2) AND ($3::int IS NULL OR b.author_id=$3) AND ($4::numeric IS NULL OR COALESCE(b.discount_price, b.price) >= $4) AND ($5::numeric IS NULL OR COALESCE(b.discount_price, b.price) <= $5)`
      const wArgs  = [search, catId, authId, minPrice, maxPrice]

      const [countRes, dataRes] = await Promise.all([
        q(`SELECT COUNT(*) FROM books b ${where}`, wArgs),
        hasLimit
          ? q(`${BOOK_JOIN} ${where} ORDER BY b.${sortBy} ${sortOrder} LIMIT $6 OFFSET $7`, [...wArgs, limit, offset])
          : q(`${BOOK_JOIN} ${where} ORDER BY b.${sortBy} ${sortOrder}`, wArgs),
      ])
      const total = parseInt(countRes.rows[0].count)
      const effectiveLimit = hasLimit ? limit : total
      return ok(res, {
        data: dataRes.rows,
        total,
        page,
        limit: effectiveLimit,
        total_pages: hasLimit ? Math.ceil(total / limit) : 1,
      })
    }

    if (pathname === '/api/books' && method === 'POST') {
      const { fields, files } = await parseMultipart(req)
      if (!fields.title) return badRequest(res, 'Title is required')
      const primaryAuthorId = parseInt(fields.author_id) || null
      const editorNames = parseEditorNames(fields.editor_names)
      if (!primaryAuthorId && editorNames.length === 0) {
        return badRequest(res, 'Please provide at least one Author or Editor')
      }
      if (fields.allow_duplicate !== 'true') {
        const dup = await findDuplicateBookTitle(fields.title, null)
        if (dup) return conflict(res, 'A book with this title already exists. Please use a different title.')
      }
      const coverUrl = await saveBookCover(files.cover_image)
      const { rows } = await q(
        `INSERT INTO books (title, subtitle, author_id, category_id, isbn, description, price, discount_price, stock_quantity, cover_image, preview_pdf, rating, external_url, publisher, total_pages, print_type, publication_year, edition, publisher_serial_number)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING id`,
        [fields.title, fields.subtitle || '', primaryAuthorId, parseInt(fields.category_id) || null,
         fields.isbn || '', fields.description || '',
         parseFloat(fields.price) || 0,
         fields.discount_price ? parseFloat(fields.discount_price) : null,
         parseInt(fields.stock_quantity) || 0,
         coverUrl || fields.cover_image || '',
         fields.preview_pdf || null,
         fields.rating ? parseFloat(fields.rating) : 0,
         fields.external_url || '',
         fields.publisher || '',
         fields.total_pages ? parseInt(fields.total_pages) : null,
         fields.print_type || '',
         fields.publication_year ? parseInt(fields.publication_year) : null,
         fields.edition || '',
         fields.publisher_serial_number || '']
      )
      await syncBookAuthors(rows[0].id, primaryAuthorId, parseCoAuthorIds(fields.co_author_ids))
      await syncBookEditors(rows[0].id, editorNames)
      const full = (await q(`${BOOK_JOIN} WHERE b.id=$1`, [rows[0].id])).rows[0]
      return created(res, full)
    }

    const bookMatch = pathname.match(/^\/api\/books\/(\d+)$/)
    if (bookMatch) {
      const id = parseInt(bookMatch[1])
      if (method === 'GET') {
        const { rows } = await q(`${BOOK_JOIN} WHERE b.id=$1`, [id])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
      if (method === 'PUT') {
        const { fields, files } = await parseMultipart(req)
        const cur  = (await q('SELECT * FROM books WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const primaryAuthorId = fields.author_id ? parseInt(fields.author_id) : cur.author_id
        const editorNames = fields.editor_names !== undefined ? parseEditorNames(fields.editor_names) : null
        let hasEditor = editorNames !== null && editorNames.length > 0
        if (editorNames === null) {
          hasEditor = (await q('SELECT 1 FROM book_editors WHERE book_id=$1 LIMIT 1', [id])).rows.length > 0
        }
        if (!primaryAuthorId && !hasEditor) {
          return badRequest(res, 'Please provide at least one Author or Editor')
        }
        const newTitle = fields.title ?? cur.title
        if (fields.title !== undefined && fields.allow_duplicate !== 'true') {
          const dup = await findDuplicateBookTitle(newTitle, id)
          if (dup) return conflict(res, 'A book with this title already exists. Please use a different title.')
        }
        const newCover = await saveBookCover(files.cover_image)
        await q(
          `UPDATE books SET title=$1, subtitle=$2, author_id=$3, category_id=$4, isbn=$5, description=$6,
           price=$7, discount_price=$8, stock_quantity=$9, cover_image=$10, preview_pdf=$11, rating=$12, external_url=$13,
           publisher=$14, total_pages=$15, print_type=$16, publication_year=$17, edition=$18, publisher_serial_number=$19
           WHERE id=$20`,
          [
            newTitle,
            fields.subtitle       ?? cur.subtitle,
            primaryAuthorId,
            fields.category_id    ? parseInt(fields.category_id)    : cur.category_id,
            fields.isbn           ?? cur.isbn,
            fields.description    ?? cur.description,
            fields.price          ? parseFloat(fields.price)        : cur.price,
            fields.discount_price !== undefined ? (fields.discount_price ? parseFloat(fields.discount_price) : null) : cur.discount_price,
            fields.stock_quantity ? parseInt(fields.stock_quantity) : cur.stock_quantity,
            newCover || fields.cover_image || cur.cover_image,
            fields.preview_pdf    ?? cur.preview_pdf,
            fields.rating         ? parseFloat(fields.rating)       : cur.rating,
            fields.external_url   ?? cur.external_url,
            fields.publisher        ?? cur.publisher,
            fields.total_pages      ? parseInt(fields.total_pages)      : cur.total_pages,
            fields.print_type       ?? cur.print_type,
            fields.publication_year ? parseInt(fields.publication_year) : cur.publication_year,
            fields.edition          ?? cur.edition,
            fields.publisher_serial_number ?? cur.publisher_serial_number,
            id,
          ]
        )
        if (fields.author_id !== undefined || fields.co_author_ids !== undefined) {
          await syncBookAuthors(id, primaryAuthorId, parseCoAuthorIds(fields.co_author_ids))
        }
        if (editorNames !== null) {
          await syncBookEditors(id, editorNames)
        }
        const full = (await q(`${BOOK_JOIN} WHERE b.id=$1`, [id])).rows[0]
        return ok(res, full)
      }
      if (method === 'DELETE') {
        await q('DELETE FROM books WHERE id=$1', [id])
        return ok(res, { message: 'Deleted' })
      }
    }

    // ── Reviews ───────────────────────────────────────────────
    const bookReviewsMatch = pathname.match(/^\/api\/books\/(\d+)\/reviews$/)
    if (bookReviewsMatch) {
      const bookId = parseInt(bookReviewsMatch[1])
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM reviews WHERE book_id=$1 ORDER BY created_at DESC', [bookId])
        return ok(res, { data: rows, total: rows.length })
      }
      if (method === 'POST') {
        const body = await parseBody(req)
        const { customer_name, customer_email, comment } = body
        const rating = parseInt(body.rating)
        if (!customer_name) return badRequest(res, 'Name is required')
        if (!comment) return badRequest(res, 'Comment is required')
        if (!rating || rating < 1 || rating > 5) return badRequest(res, 'Rating must be between 1 and 5')
        const { rows } = await q(
          'INSERT INTO reviews (book_id, customer_name, customer_email, rating, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *',
          [bookId, customer_name, customer_email || '', rating, comment]
        )
        await q(
          'UPDATE books SET rating = COALESCE((SELECT ROUND(AVG(rating),2) FROM reviews WHERE book_id=$1), 0) WHERE id=$1',
          [bookId]
        )
        return created(res, rows[0])
      }
    }

    if (pathname === '/api/reviews' && method === 'GET') {
      const { rows } = await q(
        `SELECT r.*, b.title AS book_title FROM reviews r
         LEFT JOIN books b ON r.book_id=b.id
         ORDER BY r.created_at DESC`
      )
      return ok(res, { data: rows, total: rows.length })
    }

    const reviewMatch = pathname.match(/^\/api\/reviews\/(\d+)$/)
    if (reviewMatch && method === 'DELETE') {
      const id = parseInt(reviewMatch[1])
      const existing = (await q('SELECT book_id FROM reviews WHERE id=$1', [id])).rows[0]
      if (!existing) return notFound(res)
      await q('DELETE FROM reviews WHERE id=$1', [id])
      await q(
        'UPDATE books SET rating = COALESCE((SELECT ROUND(AVG(rating),2) FROM reviews WHERE book_id=$1), 0) WHERE id=$1',
        [existing.book_id]
      )
      return ok(res, { message: 'Deleted' })
    }

    // ── Hero Banners (public, active hero-type ads sorted by display_order) ──
    if (pathname === '/api/banners' && method === 'GET') {
      const today = new Date().toISOString().slice(0, 10)
      const { rows } = await q(
        `SELECT * FROM advertisements
         WHERE is_active = true AND type = 'hero'
           AND (start_date IS NULL OR start_date <= $1)
           AND (end_date   IS NULL OR end_date   >= $1)
         ORDER BY display_order ASC, id ASC`,
        [today]
      )
      return ok(res, { data: rows, total: rows.length })
    }

    // ── Advertisements ────────────────────────────────────────
    if (pathname === '/api/advertisements' && method === 'GET') {
      const isActiveParam = params.get('is_active')
      const typeParam     = params.get('type')
      let sql  = 'SELECT * FROM advertisements'
      const conditions = []
      const args = []
      if (isActiveParam !== null) { conditions.push(`is_active=$${args.length+1}`); args.push(isActiveParam === 'true') }
      if (typeParam)              { conditions.push(`type=$${args.length+1}`);      args.push(typeParam) }
      if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
      sql += ' ORDER BY display_order ASC, id DESC'
      const { rows } = await q(sql, args)
      return ok(res, { data: rows, total: rows.length, page: 1, limit: rows.length || 10, total_pages: 1 })
    }
    if (pathname === '/api/advertisements' && method === 'POST') {
      const { fields, files } = await parseMultipart(req)
      const imageUrl = await saveBannerImage(files.banner_image)
      const isActive = fields.is_active === 'false' ? false : true
      const { rows } = await q(
        `INSERT INTO advertisements
           (title, subtitle, banner_image, redirect_url, start_date, end_date, is_active, type, display_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          fields.title || '',
          fields.subtitle || '',
          imageUrl || fields.banner_image || '',
          fields.redirect_url || '',
          fields.start_date || null,
          fields.end_date   || null,
          isActive,
          fields.type || 'banner',
          parseInt(fields.display_order || '0'),
        ]
      )
      return created(res, rows[0])
    }
    const adMatch = pathname.match(/^\/api\/advertisements\/(\d+)$/)
    if (adMatch) {
      const id = parseInt(adMatch[1])
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM advertisements WHERE id=$1', [id])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
      if (method === 'PUT') {
        const { fields, files } = await parseMultipart(req)
        const cur = (await q('SELECT * FROM advertisements WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const newImageUrl = await saveBannerImage(files.banner_image)
        const bannerImage = newImageUrl || fields.banner_image || cur.banner_image
        const isActive = fields.is_active !== undefined
          ? (fields.is_active === 'true' || fields.is_active === '1' || fields.is_active === 'on')
          : cur.is_active
        const { rows } = await q(
          `UPDATE advertisements
           SET title=$1, subtitle=$2, banner_image=$3, redirect_url=$4,
               start_date=$5, end_date=$6, is_active=$7, type=$8, display_order=$9
           WHERE id=$10 RETURNING *`,
          [
            fields.title     ?? cur.title,
            fields.subtitle  ?? cur.subtitle,
            bannerImage,
            fields.redirect_url ?? cur.redirect_url,
            fields.start_date   ?? cur.start_date,
            fields.end_date     ?? cur.end_date,
            isActive,
            fields.type         ?? cur.type,
            parseInt(fields.display_order ?? cur.display_order ?? 0),
            id,
          ]
        )
        return ok(res, rows[0])
      }
      if (method === 'DELETE') {
        await q('DELETE FROM advertisements WHERE id=$1', [id])
        return ok(res, { message: 'Deleted' })
      }
    }

    // ── Announcements ─────────────────────────────────────────
    if (pathname === '/api/announcements' && method === 'GET') {
      const activeOnly = params.get('active') === 'true'
      const userId     = params.get('user_id')
      const today = new Date().toISOString().slice(0, 10)
      let sql = 'SELECT * FROM announcements'
      const args = []
      if (activeOnly) {
        args.push(today)
        sql += ` WHERE is_active = true
                 AND (start_date IS NULL OR start_date <= $${args.length})
                 AND (end_date   IS NULL OR end_date   >= $${args.length})`
      }
      sql += ' ORDER BY priority = \'urgent\' DESC, priority = \'important\' DESC, created_at DESC'
      const { rows } = await q(sql, args)
      if (userId) {
        const { rows: readRows } = await q('SELECT announcement_id FROM announcement_reads WHERE user_id=$1', [userId])
        const readIds = new Set(readRows.map((r) => r.announcement_id))
        rows.forEach((r) => { r.is_read = readIds.has(r.id) })
      }
      return ok(res, { data: rows, total: rows.length })
    }
    if (pathname === '/api/announcements/unread-count' && method === 'GET') {
      const userId = params.get('user_id')
      if (!userId) return badRequest(res, 'user_id is required')
      const today = new Date().toISOString().slice(0, 10)
      const { rows } = await q(
        `SELECT COUNT(*)::int AS count FROM announcements a
         WHERE a.is_active = true
           AND (a.start_date IS NULL OR a.start_date <= $1)
           AND (a.end_date   IS NULL OR a.end_date   >= $1)
           AND NOT EXISTS (
             SELECT 1 FROM announcement_reads r WHERE r.announcement_id = a.id AND r.user_id = $2
           )`,
        [today, userId]
      )
      return ok(res, { count: rows[0].count })
    }
    if (pathname === '/api/announcements/read-all' && method === 'POST') {
      const body = await parseBody(req)
      if (!body.user_id) return badRequest(res, 'user_id is required')
      await q(
        `INSERT INTO announcement_reads (announcement_id, user_id)
         SELECT id, $1 FROM announcements
         ON CONFLICT (announcement_id, user_id) DO NOTHING`,
        [body.user_id]
      )
      return ok(res, { message: 'All announcements marked as read' })
    }
    const annReadMatch = pathname.match(/^\/api\/announcements\/(\d+)\/read$/)
    if (annReadMatch && method === 'POST') {
      const id = parseInt(annReadMatch[1])
      const body = await parseBody(req)
      if (!body.user_id) return badRequest(res, 'user_id is required')
      await q(
        'INSERT INTO announcement_reads (announcement_id, user_id) VALUES ($1,$2) ON CONFLICT (announcement_id, user_id) DO NOTHING',
        [id, body.user_id]
      )
      return ok(res, { message: 'Marked as read' })
    }
    if (pathname === '/api/announcements' && method === 'POST') {
      const { fields, files } = await parseMultipart(req)
      if (!fields.title)   return badRequest(res, 'Title is required')
      if (!fields.message) return badRequest(res, 'Message is required')
      const imageUrl = await saveAnnouncementImage(files.image)
      const isActive = fields.is_active === 'false' ? false : true
      const { rows } = await q(
        `INSERT INTO announcements (title, message, image, link_url, priority, is_active, start_date, end_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          fields.title,
          fields.message,
          imageUrl || '',
          fields.link_url || '',
          fields.priority || 'normal',
          isActive,
          fields.start_date || null,
          fields.end_date   || null,
        ]
      )
      return created(res, rows[0])
    }
    const annMatch = pathname.match(/^\/api\/announcements\/(\d+)$/)
    if (annMatch) {
      const id = parseInt(annMatch[1])
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM announcements WHERE id=$1', [id])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
      if (method === 'PUT') {
        const { fields, files } = await parseMultipart(req)
        const cur = (await q('SELECT * FROM announcements WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const newImageUrl = await saveAnnouncementImage(files.image)
        const image = newImageUrl || cur.image
        const isActive = fields.is_active !== undefined
          ? (fields.is_active === 'true' || fields.is_active === '1' || fields.is_active === 'on')
          : cur.is_active
        const startDate = fields.start_date !== undefined ? (fields.start_date || null) : cur.start_date
        const endDate   = fields.end_date   !== undefined ? (fields.end_date   || null) : cur.end_date
        const { rows } = await q(
          `UPDATE announcements
           SET title=$1, message=$2, image=$3, link_url=$4, priority=$5, is_active=$6, start_date=$7, end_date=$8
           WHERE id=$9 RETURNING *`,
          [
            fields.title    ?? cur.title,
            fields.message  ?? cur.message,
            image,
            fields.link_url ?? cur.link_url,
            fields.priority ?? cur.priority,
            isActive,
            startDate,
            endDate,
            id,
          ]
        )
        return ok(res, rows[0])
      }
      if (method === 'DELETE') {
        await q('DELETE FROM announcements WHERE id=$1', [id])
        return ok(res, { message: 'Deleted' })
      }
    }

    // ── Blogs ─────────────────────────────────────────────────
    const blogSlugMatch = pathname.match(/^\/api\/blogs\/slug\/(.+)$/)
    if (blogSlugMatch) {
      const slug = blogSlugMatch[1]
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM blogs WHERE slug=$1', [slug])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
    }

    if (pathname === '/api/blogs' && method === 'GET') {
      const { rows } = await q('SELECT * FROM blogs ORDER BY created_at DESC')
      return ok(res, { data: rows, total: rows.length, page: 1, limit: rows.length || 10, total_pages: 1 })
    }
    if (pathname === '/api/blogs' && method === 'POST') {
      const { fields, files } = await parseMultipart(req)
      if (!fields.title) return badRequest(res, 'Title is required')
      const slug = fields.slug || (fields.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').substring(0, 80) + '-' + Date.now())
      const imageUrl = await saveBlogImage(files.featured_image)
      const { rows } = await q(
        'INSERT INTO blogs (title, slug, content, featured_image, author_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [fields.title, slug, fields.content||'', imageUrl, fields.author_id||null]
      )
      return created(res, rows[0])
    }
    const blogMatch = pathname.match(/^\/api\/blogs\/(\d+)$/)
    if (blogMatch) {
      const id = parseInt(blogMatch[1])
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM blogs WHERE id=$1', [id])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
      if (method === 'PUT') {
        const { fields, files } = await parseMultipart(req)
        const cur  = (await q('SELECT * FROM blogs WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const newImageUrl = await saveBlogImage(files.featured_image)
        const featuredImage = newImageUrl || fields.featured_image || cur.featured_image
        const { rows } = await q(
          'UPDATE blogs SET title=$1, slug=$2, content=$3, featured_image=$4, author_id=$5 WHERE id=$6 RETURNING *',
          [fields.title??cur.title, fields.slug??cur.slug, fields.content??cur.content, featuredImage, fields.author_id??cur.author_id, id]
        )
        return ok(res, rows[0])
      }
      if (method === 'DELETE') {
        await q('DELETE FROM blogs WHERE id=$1', [id])
        return ok(res, { message: 'Deleted' })
      }
    }

    // ── Videos ────────────────────────────────────────────────
    if (pathname === '/api/videos' && method === 'GET') {
      const { rows } = await q('SELECT * FROM videos ORDER BY created_at DESC')
      return ok(res, { data: rows, total: rows.length, page: 1, limit: rows.length || 10, total_pages: 1 })
    }
    if (pathname === '/api/videos' && method === 'POST') {
      const body = await parseBody(req)
      const { rows } = await q(
        'INSERT INTO videos (youtube_id, title, thumbnail, duration, is_featured) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [body.youtube_id, body.title, body.thumbnail||'', body.duration||'', body.is_featured||false]
      )
      return created(res, rows[0])
    }
    const videoMatch = pathname.match(/^\/api\/videos\/(\d+)$/)
    if (videoMatch) {
      const id = parseInt(videoMatch[1])
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM videos WHERE id=$1', [id])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
      if (method === 'PUT') {
        const body = await parseBody(req)
        const cur  = (await q('SELECT * FROM videos WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const { rows } = await q(
          'UPDATE videos SET youtube_id=$1, title=$2, thumbnail=$3, duration=$4, is_featured=$5 WHERE id=$6 RETURNING *',
          [body.youtube_id??cur.youtube_id, body.title??cur.title, body.thumbnail??cur.thumbnail, body.duration??cur.duration, body.is_featured??cur.is_featured, id]
        )
        return ok(res, rows[0])
      }
      if (method === 'DELETE') {
        await q('DELETE FROM videos WHERE id=$1', [id])
        return ok(res, { message: 'Deleted' })
      }
    }

    // ── Orders ────────────────────────────────────────────────
    const orderStatusMatch = pathname.match(/^\/api\/orders\/(\d+)\/status$/)
    if (orderStatusMatch && method === 'PUT') {
      const id = parseInt(orderStatusMatch[1])
      const body = await parseBody(req)
      const cur  = (await q('SELECT * FROM orders WHERE id=$1', [id])).rows[0]
      if (!cur) return notFound(res)
      const { rows } = await q(
        'UPDATE orders SET order_status=$1 WHERE id=$2 RETURNING *',
        [body.order_status ?? body.status ?? cur.order_status, id]
      )
      return ok(res, rows[0])
    }

    if (pathname === '/api/orders' && method === 'POST') {
      const { fields, files } = await parseMultipart(req)
      const {
        full_name, email, phone, address_line1, address_line2,
        city, state, pincode, payment_method, payment_ref_id,
        subtotal, gst_amount, shipping_amount, total_amount, items: itemsJson,
      } = fields
      if (!full_name || !email || !address_line1 || !city || !state || !pincode || !phone) {
        return badRequest(res, 'All required shipping fields must be filled')
      }
      const items = JSON.parse(itemsJson || '[]')
      if (!items.length) return badRequest(res, 'Cart is empty')

      const attachmentPath = await savePaymentAttachment(files.payment_attachment)

      // Find or create customer
      let customerId = null
      const existCust = await q('SELECT id FROM customers WHERE email=$1', [email])
      if (existCust.rows.length) {
        customerId = existCust.rows[0].id
      } else {
        const newCust = await q(
          'INSERT INTO customers (name, email, mobile_number) VALUES ($1,$2,$3) RETURNING id',
          [full_name, email, phone]
        )
        customerId = newCust.rows[0].id
      }

      const orderNumber = 'VP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
      const shippingAddr = JSON.stringify({ full_name, address_line1, address_line2: address_line2 || '', city, state, pincode, phone })

      const { rows: [order] } = await q(
        `INSERT INTO orders (
          customer_id, order_number, subtotal, gst_amount, shipping_amount, total_amount,
          payment_method, payment_ref_id, payment_attachment, payment_status, order_status, shipping_address
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending','placed',$10) RETURNING *`,
        [
          customerId, orderNumber,
          parseFloat(subtotal || 0), parseFloat(gst_amount || 0),
          parseFloat(shipping_amount || 0), parseFloat(total_amount || 0),
          payment_method || 'qr', payment_ref_id || '',
          attachmentPath, shippingAddr,
        ]
      )

      for (const item of items) {
        await q(
          'INSERT INTO order_items (order_id, book_id, quantity, unit_price) VALUES ($1,$2,$3,$4)',
          [order.id, item.book_id, item.quantity, item.unit_price]
        )
        await q(
          'UPDATE books SET stock_quantity = stock_quantity - $1 WHERE id=$2 AND stock_quantity >= $1',
          [item.quantity, item.book_id]
        )
      }

      return created(res, order)
    }

    if (pathname === '/api/orders' && method === 'GET') {
      const { rows } = await q(`
        SELECT o.*, c.name AS customer_name, c.email AS customer_email,
          COALESCE((SELECT json_agg(json_build_object(
            'id', oi.id, 'order_id', oi.order_id, 'book_id', oi.book_id,
            'quantity', oi.quantity, 'unit_price', oi.unit_price,
            'book_title', b.title, 'book_cover', b.cover_image
          ) ORDER BY oi.id)
          FROM order_items oi LEFT JOIN books b ON b.id = oi.book_id
          WHERE oi.order_id = o.id), '[]'::json) AS items
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.created_at DESC
      `)
      return ok(res, { data: rows, total: rows.length, page: 1, limit: rows.length || 10, total_pages: 1 })
    }

    const orderMatch = pathname.match(/^\/api\/orders\/(\d+)$/)
    if (orderMatch) {
      const id = parseInt(orderMatch[1])
      if (method === 'GET') {
        const { rows: [order] } = await q(`
          SELECT o.*, c.name AS customer_name, c.email AS customer_email
          FROM orders o
          LEFT JOIN customers c ON o.customer_id = c.id
          WHERE o.id = $1
        `, [id])
        if (!order) return notFound(res)
        const { rows: items } = await q(`
          SELECT oi.*, b.title AS book_title, b.cover_image AS book_cover
          FROM order_items oi
          LEFT JOIN books b ON oi.book_id = b.id
          WHERE oi.order_id = $1
        `, [id])
        return ok(res, { ...order, items })
      }
      if (method === 'PUT') {
        const body = await parseBody(req)
        const cur  = (await q('SELECT * FROM orders WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const { rows } = await q(
          'UPDATE orders SET payment_status=$1, order_status=$2 WHERE id=$3 RETURNING *',
          [body.payment_status ?? cur.payment_status, body.order_status ?? cur.order_status, id]
        )
        return ok(res, rows[0])
      }
    }

    // ── Customers ─────────────────────────────────────────────
    if (pathname === '/api/customers' && method === 'GET') {
      const { rows } = await q(`
        SELECT c.*,
               COUNT(o.id)::int AS orders_count,
               COALESCE(SUM(o.total_amount), 0)::numeric AS total_spent
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id AND o.payment_status = 'paid'
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `)
      return ok(res, { data: rows, total: rows.length, page: 1, limit: rows.length || 10, total_pages: 1 })
    }
    if (pathname === '/api/customers' && method === 'POST') {
      const body = await parseBody(req)
      const { name, email, mobile_number = '', password } = body
      if (!name || !email || !password) return badRequest(res, 'Name, email and password are required')
      const existingCustomer = await q('SELECT id FROM customers WHERE email=$1', [email])
      if (existingCustomer.rows.length) return badRequest(res, 'A customer with this email already exists')
      const existingUser = await q('SELECT id FROM users WHERE email=$1', [email])
      if (existingUser.rows.length) return badRequest(res, 'A login already exists for this email')
      const { rows } = await q(
        'INSERT INTO customers (name, email, mobile_number) VALUES ($1,$2,$3) RETURNING *',
        [name, email, mobile_number]
      )
      await q(
        'INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)',
        [name, email, password, 'customer']
      )
      return created(res, { ...rows[0], orders_count: 0, total_spent: 0 })
    }
    const customerMatch = pathname.match(/^\/api\/customers\/(\d+)$/)
    if (customerMatch) {
      const id = parseInt(customerMatch[1])
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM customers WHERE id=$1', [id])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
      if (method === 'PUT') {
        const body = await parseBody(req)
        const cur = (await q('SELECT * FROM customers WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const name          = body.name          ?? cur.name
        const email         = body.email         ?? cur.email
        const mobile_number = body.mobile_number ?? cur.mobile_number
        if (email !== cur.email) {
          const emailTaken = await q('SELECT id FROM customers WHERE email=$1 AND id<>$2', [email, id])
          if (emailTaken.rows.length) return badRequest(res, 'A customer with this email already exists')
        }
        const { rows } = await q(
          'UPDATE customers SET name=$1, email=$2, mobile_number=$3 WHERE id=$4 RETURNING *',
          [name, email, mobile_number, id]
        )
        const existingUser = (await q("SELECT * FROM users WHERE email=$1 AND role='customer'", [cur.email])).rows[0]
        if (existingUser) {
          const password = body.password ? body.password : existingUser.password
          await q('UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4', [name, email, password, existingUser.id])
        } else if (body.password) {
          await q(
            "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,'customer')",
            [name, email, body.password]
          )
        }
        return ok(res, rows[0])
      }
      if (method === 'DELETE') {
        const cur = (await q('SELECT * FROM customers WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        await q('DELETE FROM customers WHERE id=$1', [id])
        await q("DELETE FROM users WHERE email=$1 AND role='customer'", [cur.email])
        return ok(res, { message: 'Deleted' })
      }
    }

    // ── Visitors ──────────────────────────────────────────────
    if (pathname === '/api/visitors/track' && method === 'POST') {
      const body = await parseBody(req)
      if (!body.session_id || !body.user_id || !body.email || !body.page_url) {
        return badRequest(res, 'session_id, user_id, email and page_url are required')
      }
      const { device_type, browser, operating_system } = parseUserAgent(req.headers['user-agent'])
      const ip = getClientIp(req)
      const pageName = body.page_name || getPageLabel(body.page_url)

      // Guard against duplicate rows from double-fired effects (e.g. React
      // StrictMode's mount/unmount/remount in dev) re-tracking the same page
      // within the same instant.
      const dup = await q(
        `SELECT * FROM visitor_logs
         WHERE session_id=$1 AND page_url=$2 AND visit_date_time > NOW() - INTERVAL '10 seconds'
         ORDER BY visit_date_time DESC LIMIT 1`,
        [body.session_id, body.page_url]
      )
      if (dup.rows.length) {
        return created(res, { message: 'Tracked', id: dup.rows[0].id })
      }

      const { rows } = await q(
        `INSERT INTO visitor_logs
           (session_id, user_id, user_name, email, page_name, page_url, device_type, browser, operating_system, ip_address)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [body.session_id, body.user_id, body.user_name || '', body.email, pageName, body.page_url, device_type, browser, operating_system, ip]
      )
      broadcast('visit', rows[0])
      return created(res, { message: 'Tracked', id: rows[0].id })
    }

    if (pathname === '/api/visitors/heartbeat' && method === 'POST') {
      const body = await parseBody(req)
      if (!body.session_id) return badRequest(res, 'session_id is required')
      const { rows } = await q(
        `UPDATE visitor_logs SET last_activity = NOW()
         WHERE id = (SELECT id FROM visitor_logs WHERE session_id=$1 ORDER BY visit_date_time DESC, id DESC LIMIT 1)
         RETURNING session_id, last_activity`,
        [body.session_id]
      )
      if (!rows.length) return notFound(res)
      broadcast('heartbeat', rows[0])
      return ok(res, { message: 'ok' })
    }

    if (pathname === '/api/visitors/logout' && method === 'POST') {
      const body = await parseBody(req)
      if (!body.session_id) return badRequest(res, 'session_id is required')
      await q(
        `UPDATE visitor_logs SET logged_out_at = NOW() WHERE session_id=$1 AND logged_out_at IS NULL`,
        [body.session_id]
      )
      broadcast('logout', { session_id: body.session_id })
      return ok(res, { message: 'Logged out' })
    }

    if (pathname === '/api/visitors' && method === 'GET') {
      const SORTABLE = {
        visit_date_time: 'vl.visit_date_time',
        user_name: 'vl.user_name',
        email: 'vl.email',
        page_name: 'vl.page_name',
        device_type: 'vl.device_type',
        browser: 'vl.browser',
        operating_system: 'vl.operating_system',
        login_time: 'sa.login_time',
        last_activity: 'sa.last_activity_at',
        status: 'is_online',
      }
      const sortBy  = SORTABLE[params.get('sortBy')] || 'vl.visit_date_time'
      const sortDir = params.get('sortDir') === 'asc' ? 'ASC' : 'DESC'
      const page     = Math.max(1, parseInt(params.get('page') || '1', 10))
      const pageSize = Math.min(100, Math.max(1, parseInt(params.get('pageSize') || '20', 10)))
      const offset   = (page - 1) * pageSize

      const search           = params.get('search') || ''
      const from             = params.get('from') || null
      const to               = params.get('to') || null
      const userName         = params.get('user_name') || ''
      const email            = params.get('email') || ''
      const pageNameFilter   = params.get('page_name') || ''
      const deviceType       = params.get('device_type') || ''
      const browser          = params.get('browser') || ''
      const operatingSystem  = params.get('operating_system') || ''
      const status           = params.get('status') || ''

      const { rows } = await q(
        `WITH session_agg AS (
           SELECT session_id,
                  MIN(visit_date_time) AS login_time,
                  MAX(last_activity)   AS last_activity_at,
                  MAX(logged_out_at)   AS logged_out_at
           FROM visitor_logs GROUP BY session_id
         )
         SELECT vl.*, sa.login_time, sa.last_activity_at,
                (sa.logged_out_at IS NULL AND sa.last_activity_at > NOW() - ($1 || ' minutes')::interval) AS is_online,
                COUNT(*) OVER() AS total_count
         FROM visitor_logs vl
         JOIN session_agg sa USING (session_id)
         WHERE ($2='' OR vl.user_name ILIKE '%'||$2||'%')
           AND ($3='' OR vl.email ILIKE '%'||$3||'%')
           AND ($4='' OR vl.page_name ILIKE '%'||$4||'%')
           AND ($5='' OR vl.device_type=$5)
           AND ($6='' OR vl.browser=$6)
           AND ($7='' OR vl.operating_system=$7)
           AND ($8='' OR ($8='online') = (sa.logged_out_at IS NULL AND sa.last_activity_at > NOW() - ($1 || ' minutes')::interval))
           AND ($9::date IS NULL OR vl.visit_date_time >= $9::date)
           AND ($10::date IS NULL OR vl.visit_date_time < ($10::date + INTERVAL '1 day'))
           AND ($11='' OR vl.user_name ILIKE '%'||$11||'%' OR vl.email ILIKE '%'||$11||'%' OR vl.page_name ILIKE '%'||$11||'%' OR vl.page_url ILIKE '%'||$11||'%')
         ORDER BY ${sortBy} ${sortDir}
         LIMIT $12 OFFSET $13`,
        [VISITOR_OFFLINE_THRESHOLD_MINUTES, userName, email, pageNameFilter, deviceType, browser, operatingSystem, status, from, to, search, pageSize, offset]
      )
      const total = rows.length ? parseInt(rows[0].total_count, 10) : 0
      const data = rows.map(({ total_count, ...r }) => ({ ...r, status: r.is_online ? 'online' : 'offline' }))
      return ok(res, { data, total, page, pageSize })
    }

    if (pathname === '/api/visitors/stats' && method === 'GET') {
      return ok(res, await computeVisitorStats())
    }

    if (pathname === '/api/visitors/reports' && method === 'GET') {
      const type = params.get('type') || 'pages'
      const from = params.get('from') || null
      const to   = params.get('to') || null
      const dateFilter = `($1::date IS NULL OR visit_date_time >= $1::date) AND ($2::date IS NULL OR visit_date_time < ($2::date + INTERVAL '1 day'))`

      if (type === 'pages') {
        const { rows } = await q(
          `SELECT page_name, COUNT(*)::int AS visits, COUNT(DISTINCT user_id)::int AS unique_users
           FROM visitor_logs WHERE ${dateFilter}
           GROUP BY page_name ORDER BY visits DESC LIMIT 50`,
          [from, to]
        )
        return ok(res, { type, data: rows })
      }
      if (type === 'users') {
        const { rows } = await q(
          `SELECT user_id, MAX(user_name) AS user_name, MAX(email) AS email,
                  COUNT(*)::int AS total_visits, COUNT(DISTINCT session_id)::int AS session_count,
                  MAX(visit_date_time) AS last_seen
           FROM visitor_logs WHERE ${dateFilter}
           GROUP BY user_id ORDER BY total_visits DESC LIMIT 50`,
          [from, to]
        )
        return ok(res, { type, data: rows })
      }
      if (type === 'devices' || type === 'browsers' || type === 'os') {
        const col = type === 'devices' ? 'device_type' : type === 'browsers' ? 'browser' : 'operating_system'
        const { rows } = await q(
          `SELECT ${col} AS label, COUNT(*)::int AS count
           FROM visitor_logs WHERE ${dateFilter}
           GROUP BY ${col} ORDER BY count DESC`,
          [from, to]
        )
        return ok(res, { type, data: rows })
      }
      if (type === 'sessions') {
        const { rows } = await q(
          `SELECT session_id, MAX(user_name) AS user_name, MAX(email) AS email,
                  MIN(visit_date_time) AS login_time, MAX(logged_out_at) AS logout_time,
                  MAX(last_activity) AS last_activity_at,
                  (MAX(logged_out_at) IS NULL AND MAX(last_activity) > NOW() - ($3 || ' minutes')::interval) AS is_online,
                  EXTRACT(EPOCH FROM (COALESCE(MAX(logged_out_at), MAX(last_activity)) - MIN(visit_date_time)))::int AS duration_seconds
           FROM visitor_logs WHERE ${dateFilter}
           GROUP BY session_id ORDER BY login_time DESC LIMIT 100`,
          [from, to, VISITOR_OFFLINE_THRESHOLD_MINUTES]
        )
        const data = rows.map((r) => ({ ...r, status: r.is_online ? 'online' : 'offline' }))
        return ok(res, { type, data })
      }
      return badRequest(res, 'Unknown report type')
    }

    // ── Reports ───────────────────────────────────────────────
    const REPORT_PERIOD_CFG = {
      daily:   { unit: 'day',   count: 30, fmt: 'Mon DD'   },
      weekly:  { unit: 'week',  count: 12, fmt: 'Mon DD'   },
      monthly: { unit: 'month', count: 12, fmt: 'Mon YYYY' },
      yearly:  { unit: 'year',  count: 6,  fmt: 'YYYY'     },
    }
    if (pathname === '/api/reports/sales' && method === 'GET') {
      const from = params.get('from')
      const to = params.get('to')

      let rows
      if (from && to) {
        ;({ rows } = await q(`
          SELECT to_char(d::date, 'Mon DD') AS date,
                 COALESCE(COUNT(o.id), 0)::int AS orders,
                 COALESCE(SUM(o.total_amount), 0)::float AS revenue
          FROM generate_series($1::date, $2::date, INTERVAL '1 day') d
          LEFT JOIN orders o ON DATE(o.created_at) = d::date
          GROUP BY d
          ORDER BY d
        `, [from, to]))
      } else {
        const cfg = REPORT_PERIOD_CFG[params.get('period')] || REPORT_PERIOD_CFG.daily
        ;({ rows } = await q(`
          SELECT to_char(d, '${cfg.fmt}') AS date,
                 COALESCE(COUNT(o.id), 0)::int AS orders,
                 COALESCE(SUM(o.total_amount), 0)::float AS revenue
          FROM generate_series(
                 date_trunc('${cfg.unit}', NOW()) - INTERVAL '${cfg.count - 1} ${cfg.unit}',
                 date_trunc('${cfg.unit}', NOW()),
                 INTERVAL '1 ${cfg.unit}'
               ) d
          LEFT JOIN orders o ON date_trunc('${cfg.unit}', o.created_at) = d
          GROUP BY d
          ORDER BY d
        `))
      }
      return ok(res, rows)
    }

    if (pathname === '/api/reports/revenue' && method === 'GET') {
      const from = params.get('from')
      const to = params.get('to')

      let rows
      if (from && to) {
        ;({ rows } = await q(`
          SELECT to_char(d::date, 'Mon DD') AS date,
                 COALESCE(SUM(o.total_amount), 0)::float AS revenue
          FROM generate_series($1::date, $2::date, INTERVAL '1 day') d
          LEFT JOIN orders o ON DATE(o.created_at) = d::date
          GROUP BY d
          ORDER BY d
        `, [from, to]))
      } else {
        const cfg = REPORT_PERIOD_CFG[params.get('period')] || REPORT_PERIOD_CFG.monthly
        ;({ rows } = await q(`
          SELECT to_char(d, '${cfg.fmt}') AS date,
                 COALESCE(SUM(o.total_amount), 0)::float AS revenue
          FROM generate_series(
                 date_trunc('${cfg.unit}', NOW()) - INTERVAL '${cfg.count - 1} ${cfg.unit}',
                 date_trunc('${cfg.unit}', NOW()),
                 INTERVAL '1 ${cfg.unit}'
               ) d
          LEFT JOIN orders o ON date_trunc('${cfg.unit}', o.created_at) = d
          GROUP BY d
          ORDER BY d
        `))
      }
      return ok(res, rows)
    }

    if (pathname === '/api/reports/popular-books' && method === 'GET') {
      const { rows } = await q(`
        SELECT b.id, b.title, b.cover_image,
               SUM(oi.quantity)::int AS total_sold,
               SUM(oi.quantity * oi.unit_price)::float AS revenue
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id AND o.payment_status = 'paid'
        JOIN books b  ON b.id = oi.book_id
        GROUP BY b.id
        ORDER BY total_sold DESC
        LIMIT 10
      `)
      return ok(res, rows)
    }

    if (pathname === '/api/reports/customers' && method === 'GET') {
      const totals = (await q(`
        SELECT
          (SELECT COUNT(*)::int FROM customers) AS total_customers,
          (SELECT COUNT(*)::int FROM customers WHERE created_at >= date_trunc('month', NOW())) AS new_this_month
      `)).rows[0]
      const { rows: top_customers } = await q(`
        SELECT c.id, c.name,
               COUNT(o.id)::int AS orders,
               SUM(o.total_amount)::float AS total_spent
        FROM customers c
        JOIN orders o ON o.customer_id = c.id AND o.payment_status = 'paid'
        GROUP BY c.id
        ORDER BY total_spent DESC
        LIMIT 10
      `)
      return ok(res, { ...totals, top_customers })
    }

    // ── Dashboard ─────────────────────────────────────────────
    if (pathname === '/api/dashboard/stats' && method === 'GET') {
      const s = (await q(`
        SELECT
          (SELECT COUNT(*)::int FROM orders)    AS total_orders,
          (SELECT COUNT(*)::int FROM books)     AS total_books,
          (SELECT COUNT(*)::int FROM customers) AS total_customers,
          (SELECT COALESCE(SUM(total_amount),0)::float FROM orders WHERE payment_status='paid') AS total_revenue,
          (SELECT COUNT(*)::int FROM orders WHERE created_at >= date_trunc('month', NOW())) AS orders_this_month,
          (SELECT COUNT(*)::int FROM orders WHERE created_at >= date_trunc('month', NOW() - INTERVAL '1 month') AND created_at < date_trunc('month', NOW())) AS orders_last_month,
          (SELECT COUNT(*)::int FROM customers WHERE created_at >= date_trunc('month', NOW())) AS customers_this_month,
          (SELECT COUNT(*)::int FROM customers WHERE created_at >= date_trunc('month', NOW() - INTERVAL '1 month') AND created_at < date_trunc('month', NOW())) AS customers_last_month,
          (SELECT COALESCE(SUM(total_amount),0)::float FROM orders WHERE payment_status='paid' AND created_at >= date_trunc('month', NOW())) AS revenue_this_month,
          (SELECT COALESCE(SUM(total_amount),0)::float FROM orders WHERE payment_status='paid' AND created_at >= date_trunc('month', NOW() - INTERVAL '1 month') AND created_at < date_trunc('month', NOW())) AS revenue_last_month
      `)).rows[0]

      const pctChange = (curr, prev) => {
        if (!prev) return curr > 0 ? 100 : 0
        return Math.round(((curr - prev) / prev) * 100)
      }

      return ok(res, {
        total_orders:    s.total_orders,
        total_books:     s.total_books,
        total_customers: s.total_customers,
        total_revenue:   s.total_revenue,
        orders_trend:    pctChange(s.orders_this_month, s.orders_last_month),
        customers_trend: pctChange(s.customers_this_month, s.customers_last_month),
        revenue_trend:   pctChange(s.revenue_this_month, s.revenue_last_month),
      })
    }

    // ── Gifts ──────────────────────────────────────────────────
    if (pathname === '/api/gifts/featured' && method === 'GET') {
      const limit = Math.max(1, parseInt(params.get('limit') || '8'))
      const { rows } = await q(
        'SELECT * FROM gift_items WHERE is_featured=true AND is_active=true ORDER BY display_order ASC, created_at DESC LIMIT $1',
        [limit]
      )
      return ok(res, { data: rows, total: rows.length })
    }

    if (pathname === '/api/gifts/trending' && method === 'GET') {
      const limit = Math.max(1, parseInt(params.get('limit') || '8'))
      const { rows } = await q(
        'SELECT * FROM gift_items WHERE is_trending=true AND is_active=true ORDER BY display_order ASC, created_at DESC LIMIT $1',
        [limit]
      )
      return ok(res, { data: rows, total: rows.length })
    }

    const giftSlugMatch = pathname.match(/^\/api\/gifts\/slug\/(.+)$/)
    if (giftSlugMatch) {
      const slug = giftSlugMatch[1]
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM gift_items WHERE slug=$1', [slug])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
    }

    if (pathname === '/api/gifts/enquiry' && method === 'POST') {
      const body = await parseBody(req)
      const { customer_name, phone_number, email, gift_id, message } = body
      if (!customer_name) return badRequest(res, 'Name is required')
      const { rows } = await q(
        'INSERT INTO gift_enquiries (customer_name, phone_number, email, gift_id, message) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [customer_name, phone_number || '', email || '', gift_id || null, message || '']
      )
      return created(res, rows[0])
    }

    if (pathname === '/api/gifts/enquiries' && method === 'GET') {
      const { rows } = await q(
        `SELECT ge.*, gi.title AS gift_title FROM gift_enquiries ge
         LEFT JOIN gift_items gi ON ge.gift_id=gi.id
         ORDER BY ge.created_at DESC`
      )
      return ok(res, { data: rows, total: rows.length })
    }

    // ── Donate Books ──────────────────────────────────────────
    if (pathname === '/api/donate-books' && method === 'POST') {
      const body = await parseBody(req)
      const { name, email, phone_number, best_time_to_call, comments } = body
      if (!name) return badRequest(res, 'Name is required')
      if (!phone_number) return badRequest(res, 'Phone number is required')
      const { rows } = await q(
        'INSERT INTO book_donations (name, email, phone_number, best_time_to_call, comments) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [name, email || '', phone_number, best_time_to_call || '', comments || '']
      )
      return created(res, rows[0])
    }

    if (pathname === '/api/donate-books' && method === 'GET') {
      const { rows } = await q('SELECT * FROM book_donations ORDER BY created_at DESC')
      return ok(res, { data: rows, total: rows.length })
    }

    // ── Corporate Enquiries ────────────────────────────────────
    if (pathname === '/api/corporate-enquiries' && method === 'POST') {
      const body = await parseBody(req)
      const { company_name, contact_person_name, email, phone_number, best_time_to_call, enquiry_type, comments } = body
      if (!company_name) return badRequest(res, 'Company / Institution name is required')
      if (!contact_person_name) return badRequest(res, 'Contact person name is required')
      if (!phone_number) return badRequest(res, 'Phone number is required')
      if (!enquiry_type) return badRequest(res, 'Enquiry type is required')
      const { rows } = await q(
        'INSERT INTO corporate_enquiries (company_name, contact_person_name, email, phone_number, best_time_to_call, enquiry_type, comments) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [company_name, contact_person_name, email || '', phone_number, best_time_to_call || '', enquiry_type, comments || '']
      )
      return created(res, rows[0])
    }

    if (pathname === '/api/corporate-enquiries' && method === 'GET') {
      const { rows } = await q('SELECT * FROM corporate_enquiries ORDER BY created_at DESC')
      return ok(res, { data: rows, total: rows.length })
    }

    // ── Copyright Enquiries ────────────────────────────────────
    if (pathname === '/api/copyright-enquiries' && method === 'POST') {
      const body = await parseBody(req)
      const { applicant_name, email, phone_number, book_id, enquiry_type, comments } = body
      if (!applicant_name) return badRequest(res, 'Applicant name is required')
      if (!email) return badRequest(res, 'Email is required')
      if (!phone_number) return badRequest(res, 'Phone number is required')
      if (!book_id) return badRequest(res, 'Please select a book')
      const { rows } = await q(
        'INSERT INTO copyright_enquiries (applicant_name, email, phone_number, book_id, enquiry_type, comments) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [applicant_name, email, phone_number, parseInt(book_id), enquiry_type || 'Other', comments || '']
      )
      return created(res, rows[0])
    }

    if (pathname === '/api/copyright-enquiries' && method === 'GET') {
      const { rows } = await q(
        `SELECT ce.*, b.title AS book_title FROM copyright_enquiries ce
         LEFT JOIN books b ON ce.book_id=b.id
         ORDER BY ce.created_at DESC`
      )
      return ok(res, { data: rows, total: rows.length })
    }

    if (pathname === '/api/gifts' && method === 'GET') {
      const search   = params.get('search')   || ''
      const category = params.get('category') || ''
      const page     = Math.max(1, parseInt(params.get('page')  || '1'))
      const limit    = Math.max(1, parseInt(params.get('limit') || '12'))
      const offset   = (page - 1) * limit
      const where = `WHERE ($1='' OR title ILIKE '%'||$1||'%') AND ($2='' OR category=$2)`
      const wArgs = [search, category]
      const [countRes, dataRes] = await Promise.all([
        q(`SELECT COUNT(*) FROM gift_items ${where}`, wArgs),
        q(`SELECT * FROM gift_items ${where} ORDER BY display_order ASC, created_at DESC LIMIT $3 OFFSET $4`, [...wArgs, limit, offset]),
      ])
      const total = parseInt(countRes.rows[0].count)
      return ok(res, { data: dataRes.rows, total, page, limit, total_pages: Math.ceil(total / limit) })
    }

    if (pathname === '/api/gifts' && method === 'POST') {
      const { fields, files } = await parseMultipart(req)
      if (!fields.title) return badRequest(res, 'Title is required')
      const coverImageUrl = await saveGiftImage(files.cover_image)
      const { rows: inserted } = await q(
        `INSERT INTO gift_items (title, slug, short_description, description, category, cover_image, gallery, video_url, is_featured, is_trending, is_active, display_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
        [fields.title, 'temp-' + Date.now(), fields.short_description || '', fields.description || '',
         fields.category || 'Gift Currency Notes', coverImageUrl,
         JSON.stringify([]), fields.video_url || '',
         fields.is_featured === 'true', fields.is_trending === 'true',
         fields.is_active !== 'false',
         parseInt(fields.display_order) || 0]
      )
      const newId = inserted[0].id
      const { rows } = await q(`UPDATE gift_items SET slug=$1 WHERE id=$2 RETURNING *`, [`gift-${newId}`, newId])
      return created(res, rows[0])
    }

    const giftMatch = pathname.match(/^\/api\/gifts\/(\d+)$/)
    if (giftMatch) {
      const id = parseInt(giftMatch[1])
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM gift_items WHERE id=$1', [id])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
      if (method === 'PUT') {
        const { fields, files } = await parseMultipart(req)
        const cur  = (await q('SELECT * FROM gift_items WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const newImageUrl = await saveGiftImage(files.cover_image)
        const coverImage  = newImageUrl || fields.cover_image || cur.cover_image
        const { rows } = await q(
          `UPDATE gift_items SET title=$1, slug=$2, short_description=$3, description=$4,
           category=$5, cover_image=$6, gallery=$7, video_url=$8,
           is_featured=$9, is_trending=$10, is_active=$11, display_order=$12, updated_at=NOW()
           WHERE id=$13 RETURNING *`,
          [
            fields.title             ?? cur.title,
            cur.slug,
            fields.short_description ?? cur.short_description,
            fields.description       ?? cur.description,
            fields.category          ?? cur.category,
            coverImage,
            JSON.stringify(cur.gallery ?? []),
            fields.video_url         ?? cur.video_url,
            fields.is_featured !== undefined ? fields.is_featured === 'true' : cur.is_featured,
            fields.is_trending !== undefined ? fields.is_trending === 'true' : cur.is_trending,
            fields.is_active   !== undefined ? fields.is_active   !== 'false' : cur.is_active,
            fields.display_order !== undefined ? parseInt(fields.display_order) : cur.display_order,
            id,
          ]
        )
        return ok(res, rows[0])
      }
      if (method === 'DELETE') {
        await q('DELETE FROM gift_items WHERE id=$1', [id])
        return ok(res, { message: 'Deleted' })
      }
    }

    notFound(res)
  } catch (e) {
    serverErr(res, e)
  }
})

// ── WebSocket (real-time visitor tracking) ──────────────────────
const { WebSocketServer } = require('ws')
const wss = new WebSocketServer({ server })
wss.on('connection', (ws) => {
  wsClients.add(ws)
  ws.on('close', () => wsClients.delete(ws))
  ws.on('error', () => wsClients.delete(ws))
})
setInterval(() => {
  if (!wsClients.size) return
  computeVisitorStats().then((stats) => broadcast('stats', stats)).catch(() => {})
}, 10000)

// ── Start ─────────────────────────────────────────────────────
initDB()
  .then(() => {
    server.listen(5000, () => {
      console.log('✅  API server running at http://localhost:5000')
      console.log('   Admin login → email: admin@vaalu.com  password: admin123')
    })
  })
  .catch((e) => {
    console.error('❌  Database connection failed:', e.message)
    console.error('    Check DATABASE_URL in .env and ensure PostgreSQL is running.')
    process.exit(1)
  })
