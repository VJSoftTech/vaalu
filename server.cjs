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
fs.mkdirSync(UPLOADS_GIFTS,   { recursive: true })
fs.mkdirSync(UPLOADS_BLOGS,   { recursive: true })
fs.mkdirSync(UPLOADS_AUTHORS, { recursive: true })
fs.mkdirSync(UPLOADS_BOOKS,   { recursive: true })
fs.mkdirSync(UPLOADS_BANNERS, { recursive: true })
fs.mkdirSync(UPLOADS_ANNOUNCEMENTS, { recursive: true })

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
      id             SERIAL PRIMARY KEY,
      title          VARCHAR(500) NOT NULL,
      author_id      INTEGER REFERENCES authors(id) ON DELETE SET NULL,
      category_id    INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      isbn           VARCHAR(50),
      description    TEXT          DEFAULT '',
      price          DECIMAL(10,2) NOT NULL DEFAULT 0,
      discount_price DECIMAL(10,2),
      stock_quantity INTEGER       DEFAULT 0,
      cover_image    VARCHAR(500)  DEFAULT '',
      preview_pdf    VARCHAR(500),
      rating         DECIMAL(3,2)  DEFAULT 0,
      external_url   VARCHAR(500)  DEFAULT '',
      created_at     TIMESTAMPTZ   DEFAULT NOW()
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

  // Schema migrations: add columns that may be missing from tables created by older schemas
  await pool.query(`
    ALTER TABLE gift_items ADD COLUMN IF NOT EXISTS price        DECIMAL(10,2) NOT NULL DEFAULT 0;
    ALTER TABLE gift_items ADD COLUMN IF NOT EXISTS offer_price  DECIMAL(10,2);
    ALTER TABLE gift_items ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMPTZ   DEFAULT NOW();
    ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS type          VARCHAR(50)  DEFAULT 'banner';
    ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS display_order INTEGER      DEFAULT 0;
    ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS subtitle      VARCHAR(500) DEFAULT '';
    ALTER TABLE books ADD COLUMN IF NOT EXISTS external_url VARCHAR(500) DEFAULT '';
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

const BOOK_JOIN = `
  SELECT b.*, a.name AS author_name, c.name AS category_name
  FROM books b
  LEFT JOIN authors    a ON b.author_id    = a.id
  LEFT JOIN categories c ON b.category_id  = c.id
`

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
      const limit  = Math.max(1, parseInt(params.get('limit') || '12'))
      const offset = (page - 1) * limit

      const ALLOWED_SORT = new Set(['created_at', 'price', 'rating', 'title', 'stock_quantity'])
      const sortBy    = ALLOWED_SORT.has(params.get('sort_by')) ? params.get('sort_by') : 'created_at'
      const sortOrder = params.get('sort_order') === 'asc' ? 'ASC' : 'DESC'

      const minPrice = params.get('min_price') ? parseFloat(params.get('min_price')) : null
      const maxPrice = params.get('max_price') ? parseFloat(params.get('max_price')) : null

      const where  = `WHERE ($1='' OR b.title ILIKE '%'||$1||'%') AND ($2::int IS NULL OR b.category_id=$2) AND ($3::int IS NULL OR b.author_id=$3) AND ($4::numeric IS NULL OR COALESCE(b.discount_price, b.price) >= $4) AND ($5::numeric IS NULL OR COALESCE(b.discount_price, b.price) <= $5)`
      const wArgs  = [search, catId, authId, minPrice, maxPrice]

      const [countRes, dataRes] = await Promise.all([
        q(`SELECT COUNT(*) FROM books b ${where}`, wArgs),
        q(`${BOOK_JOIN} ${where} ORDER BY b.${sortBy} ${sortOrder} LIMIT $6 OFFSET $7`, [...wArgs, limit, offset]),
      ])
      const total = parseInt(countRes.rows[0].count)
      return ok(res, { data: dataRes.rows, total, page, limit, total_pages: Math.ceil(total / limit) })
    }

    if (pathname === '/api/books' && method === 'POST') {
      const { fields, files } = await parseMultipart(req)
      if (!fields.title) return badRequest(res, 'Title is required')
      const coverUrl = await saveBookCover(files.cover_image)
      const { rows } = await q(
        `INSERT INTO books (title, author_id, category_id, isbn, description, price, discount_price, stock_quantity, cover_image, preview_pdf, rating, external_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
        [fields.title, parseInt(fields.author_id) || null, parseInt(fields.category_id) || null,
         fields.isbn || '', fields.description || '',
         parseFloat(fields.price) || 0,
         fields.discount_price ? parseFloat(fields.discount_price) : null,
         parseInt(fields.stock_quantity) || 0,
         coverUrl || fields.cover_image || '',
         fields.preview_pdf || null,
         fields.rating ? parseFloat(fields.rating) : 0,
         fields.external_url || '']
      )
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
        const newCover = await saveBookCover(files.cover_image)
        await q(
          `UPDATE books SET title=$1, author_id=$2, category_id=$3, isbn=$4, description=$5,
           price=$6, discount_price=$7, stock_quantity=$8, cover_image=$9, preview_pdf=$10, rating=$11, external_url=$12
           WHERE id=$13`,
          [
            fields.title          ?? cur.title,
            fields.author_id      ? parseInt(fields.author_id)      : cur.author_id,
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
            id,
          ]
        )
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
        [body.status ?? cur.order_status, id]
      )
      return ok(res, rows[0])
    }

    if (pathname === '/api/orders' && method === 'GET') {
      const { rows } = await q('SELECT * FROM orders ORDER BY created_at DESC')
      return ok(res, { data: rows, total: rows.length, page: 1, limit: rows.length || 10, total_pages: 1 })
    }
    const orderMatch = pathname.match(/^\/api\/orders\/(\d+)$/)
    if (orderMatch) {
      const id = parseInt(orderMatch[1])
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM orders WHERE id=$1', [id])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
      if (method === 'PUT') {
        const body = await parseBody(req)
        const cur  = (await q('SELECT * FROM orders WHERE id=$1', [id])).rows[0]
        if (!cur) return notFound(res)
        const { rows } = await q(
          'UPDATE orders SET payment_status=$1, order_status=$2 WHERE id=$3 RETURNING *',
          [body.payment_status??cur.payment_status, body.order_status??cur.order_status, id]
        )
        return ok(res, rows[0])
      }
    }

    // ── Customers ─────────────────────────────────────────────
    if (pathname === '/api/customers' && method === 'GET') {
      const { rows } = await q('SELECT * FROM customers ORDER BY created_at DESC')
      return ok(res, { data: rows, total: rows.length, page: 1, limit: rows.length || 10, total_pages: 1 })
    }
    const customerMatch = pathname.match(/^\/api\/customers\/(\d+)$/)
    if (customerMatch) {
      const id = parseInt(customerMatch[1])
      if (method === 'GET') {
        const { rows } = await q('SELECT * FROM customers WHERE id=$1', [id])
        return rows.length ? ok(res, rows[0]) : notFound(res)
      }
    }

    // ── Reports ───────────────────────────────────────────────
    if (pathname === '/api/reports/sales' && method === 'GET') {
      const { rows } = await q(`
        SELECT to_char(d::date, 'Mon DD') AS date,
               COALESCE(COUNT(o.id), 0)::int AS orders,
               COALESCE(SUM(o.total_amount), 0)::float AS revenue
        FROM generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, INTERVAL '1 day') d
        LEFT JOIN orders o ON DATE(o.created_at) = d::date AND o.payment_status = 'paid'
        GROUP BY d
        ORDER BY d
      `)
      return ok(res, rows)
    }

    if (pathname === '/api/reports/revenue' && method === 'GET') {
      const periodCfg = {
        daily:   { unit: 'day',   count: 30, fmt: 'Mon DD'   },
        weekly:  { unit: 'week',  count: 12, fmt: 'Mon DD'   },
        monthly: { unit: 'month', count: 12, fmt: 'Mon YYYY' },
        yearly:  { unit: 'year',  count: 6,  fmt: 'YYYY'     },
      }
      const cfg = periodCfg[params.get('period')] || periodCfg.monthly
      const { rows } = await q(`
        SELECT to_char(d, '${cfg.fmt}') AS date,
               COALESCE(SUM(o.total_amount), 0)::float AS revenue
        FROM generate_series(
               date_trunc('${cfg.unit}', NOW()) - INTERVAL '${cfg.count - 1} ${cfg.unit}',
               date_trunc('${cfg.unit}', NOW()),
               INTERVAL '1 ${cfg.unit}'
             ) d
        LEFT JOIN orders o ON date_trunc('${cfg.unit}', o.created_at) = d AND o.payment_status = 'paid'
        GROUP BY d
        ORDER BY d
      `)
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
