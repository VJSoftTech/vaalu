// Vaalu Pathippagam - API Seed Script
// Usage: node seed.js
// Requires a running backend at http://localhost:5000
// Set ADMIN_EMAIL and ADMIN_PASSWORD env vars or edit the values below.

const BASE_URL = process.env.API_URL || 'http://localhost:5000'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vaalupathippagam.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

async function request(method, path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(json)}`)
  return json
}

const categories = [
  { name: 'சிறுவர் இலக்கியம்', slug: 'siruvar-ilakkiyam' },
  { name: 'கவிதை',              slug: 'kavithai' },
  { name: 'வரலாறு',             slug: 'varalaru' },
  { name: 'மருத்துவம்',          slug: 'maruthuvam' },
  { name: 'சிறுகதை',            slug: 'sirugadhai' },
]

const authors = [
  {
    name: 'மோ.கணேசன்',
    biography: 'மோ.கணேசன் ஒரு சிறந்த தமிழ் எழுத்தாளர். கவிதை, சிறுகதை, கட்டுரை என பல இலக்கிய வடிவங்களில் ஆற்றல் மிக்கவர். வாலு பதிப்பகத்தின் முன்னணி படைப்பாளி.',
    social_links: { facebook: 'https://facebook.com', twitter: 'https://twitter.com' },
  },
  {
    name: 'ச.முத்துராமி',
    biography: 'ச.முத்துராமி தமிழ் இலக்கியத்தில் சிறப்பிடம் பெற்ற எழுத்தாளர். கல்வி சார்ந்த படைப்புகளில் விசேஷ ஆர்வம் கொண்டவர். பல்கலைக்கழக விரிவுரையாளராகவும் பணியாற்றியவர்.',
    social_links: { website: 'https://example.com' },
  },
  {
    name: 'Dr. தெய்விகமணி',
    biography: 'Dr. தெய்விகமணி சித்த மருத்துவ நிபுணர். எளிய தமிழில் மருத்துவ அறிவை மக்களுக்கு எடுத்துச் செல்லும் படைப்பாளி. 20 ஆண்டுகளுக்கும் மேலான மருத்துவ அனுபவம் உடையவர்.',
    social_links: { instagram: 'https://instagram.com' },
  },
  {
    name: 'க.மாதேவன்',
    biography: 'க.மாதேவன் தமிழ் இலக்கியத்தில் ஆழமான சிந்தனையாளர். கவிதை மற்றும் கதை வடிவங்களில் தனித்துவமான குரல் கொண்டவர். தேசிய கவிதை விருது பெற்றவர்.',
    social_links: { facebook: 'https://facebook.com', instagram: 'https://instagram.com' },
  },
  {
    name: 'வாலு பதிப்பகம்',
    biography: 'வாலு பதிப்பகம் தமிழ் இலக்கியத்தை ஊக்குவிக்கும் ஒரு முன்னணி வெளியீட்டு நிறுவனம். புதிய படைப்பாளிகளை ஊக்குவித்து தமிழ் இலக்கியத்தை செழிப்படைய செய்கிறது.',
    social_links: { website: 'https://vaalupathippagam.com', facebook: 'https://facebook.com' },
  },
]

// authorName and categorySlug are resolved at runtime
const books = [
  {
    title: 'குட்டித் தவளை கோபாலு - சிறுவர் பாடல்கள்',
    authorName: 'வாலு பதிப்பகம்',
    categorySlug: 'siruvar-ilakkiyam',
    isbn: '9789388001001',
    description: 'குழந்தைகளுக்கான அழகிய சிறுவர் பாடல்கள் தொகுப்பு. குட்டித் தவளை கோபாலுவின் கதையை பாடல் வடிவில் சொல்லும் மகிழ்வான நூல். குழந்தைகளின் மொழி வளர்ச்சிக்கும் கற்பனை திறனுக்கும் உதவும் படைப்பு.',
    price: 120,
    discount_price: 100,
    stock_quantity: 50,
    rating: 4.5,
  },
  {
    title: 'காலை வண்ணக் காதல் கவிதைகள் - 100',
    authorName: 'மோ.கணேசன்',
    categorySlug: 'kavithai',
    isbn: '9789388001002',
    description: 'காலை வேளையில் மனதை மகிழ்விக்கும் 100 காதல் கவிதைகள். மோ.கணேசன் அவர்களின் இனிய கவிதை மொழி நம் மனதை நிறைக்கும். காதல், இயற்கை, வாழ்க்கை என பல்வேறு தலைப்புகளில் கவிதைகள் இடம்பெற்றுள்ளன.',
    price: 150,
    discount_price: 130,
    stock_quantity: 40,
    rating: 4.6,
  },
  {
    title: 'அறிவும் அனுபவமும்',
    authorName: 'மோ.கணேசன்',
    categorySlug: 'sirugadhai',
    isbn: '9789388001003',
    description: 'வாழ்க்கையில் அறிவும் அனுபவமும் எவ்வாறு இணைந்து செயல்படுகின்றன என்பதை விளக்கும் சிந்தனை நூல். நடைமுறை வாழ்வில் கற்றுக்கொண்ட பாடங்களை கதை வடிவில் சொல்லும் தனித்துவமான படைப்பு.',
    price: 160,
    discount_price: 140,
    stock_quantity: 35,
    rating: 4.4,
  },
  {
    title: 'இந்திய நிர்வாகம் குறித்த பொதுத்தகவல்',
    authorName: 'ச.முத்துராமி',
    categorySlug: 'varalaru',
    isbn: '9789388001004',
    description: 'இந்திய நிர்வாக அமைப்பு குறித்த தெளிவான, புரிந்துகொள்ளக்கூடிய வகையில் எழுதப்பட்ட பொதுத் தகவல் நூல். போட்டித் தேர்வுகளுக்கு தயாராவோருக்கு மிகவும் பயனுள்ள வழிகாட்டி.',
    price: 200,
    discount_price: 175,
    stock_quantity: 30,
    rating: 4.3,
  },
  {
    title: 'இரு பக்க கதைகள்',
    authorName: 'மோ.கணேசன்',
    categorySlug: 'sirugadhai',
    isbn: '9789388001005',
    description: 'இரு பக்கங்களில் முழுமையான உணர்வை தரும் சிறுகதைகள் தொகுப்பு. மோ.கணேசனின் சிறப்பான கதை சொல்லும் திறன் காட்டும் நூல். வாழ்க்கையின் நுண்ணிய தருணங்களை பிடித்துவைக்கும் கதைகள்.',
    price: 130,
    discount_price: 110,
    stock_quantity: 60,
    rating: 4.6,
  },
  {
    title: 'உணர்வில் சத்துகள்',
    authorName: 'மோ.கணேசன்',
    categorySlug: 'kavithai',
    isbn: '9789388001006',
    description: 'மனித உணர்வுகளை ஆழமாக பதிவு செய்யும் கவிதை தொகுப்பு. உள்ளத்தை நெகிழ்விக்கும் வரிகள். துயரம், மகிழ்ச்சி, தனிமை என்று வாழ்க்கையின் ஒவ்வொரு பரிமாணத்தையும் தொடும் கவிதைகள்.',
    price: 140,
    discount_price: 120,
    stock_quantity: 50,
    rating: 4.7,
  },
  {
    title: 'எளிய சித்த மருந்துகள் குறிப்புகள்',
    authorName: 'Dr. தெய்விகமணி',
    categorySlug: 'maruthuvam',
    isbn: '9789388001007',
    description: 'வீட்டிலேயே கடைபிடிக்கக்கூடிய எளிய சித்த மருத்துவ குறிப்புகள் தொகுப்பு. Dr. தெய்விகமணி அவர்களின் மருத்துவ அனுபவ வழிகாட்டல். பொதுவான நோய்களுக்கு இயற்கை வழி தீர்வுகள் அளிக்கும் நூல்.',
    price: 220,
    discount_price: 190,
    stock_quantity: 60,
    rating: 4.8,
  },
  {
    title: 'ஒரு காயம் விடாது',
    authorName: 'க.மாதேவன்',
    categorySlug: 'kavithai',
    isbn: '9789388001008',
    description: 'உள்ளத்தில் தாக்கம் ஏற்படுத்தும் கவிதைகளின் தொகுப்பு. க.மாதேவன் அவர்களின் தனித்துவமான கவிதை உலகம். இழப்பு, நம்பிக்கை மற்றும் மீட்சி குறித்த ஆழமான உரையாடல்.',
    price: 145,
    discount_price: 125,
    stock_quantity: 45,
    rating: 4.6,
  },
  {
    title: 'ஒரு பக்க கதைகள்',
    authorName: 'மோ.கணேசன்',
    categorySlug: 'sirugadhai',
    isbn: '9789388001009',
    description: 'ஒரே ஒரு பக்கத்தில் முழுமையான உலகை காட்டும் மினி கதைகள். மோ.கணேசனின் கதை சொல்லும் கலையின் உச்சம். ஒவ்வொரு கதையும் ஒரு சிறு திரைப்படம் போல் உணர்வை வழங்கும்.',
    price: 120,
    discount_price: 100,
    stock_quantity: 70,
    rating: 4.8,
  },
  {
    title: 'கதை கதையாம் விடுகதையாம்',
    authorName: 'வாலு பதிப்பகம்',
    categorySlug: 'siruvar-ilakkiyam',
    isbn: '9789388001010',
    description: 'குழந்தைகளுக்கான கதைகளும் விடுகதைகளும் இணைந்த மகிழ்வான நூல். கற்பனை திறனை வளர்க்கும் படைப்பு. ஒவ்வொரு கதையிலும் ஒரு நீதியும், ஒவ்வொரு விடுகதையிலும் ஒரு சவாலும் உள்ளது.',
    price: 110,
    discount_price: 90,
    stock_quantity: 80,
    rating: 4.7,
  },
]

async function seed() {
  console.log('🌱 Vaalu Pathippagam - Seeding sample data...\n')

  // 1. Login
  console.log('→ Logging in as admin...')
  const loginRes = await request('POST', '/api/auth/login', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  })
  const token = loginRes.token ?? loginRes.data?.token
  if (!token) throw new Error('Login failed — no token returned')
  console.log('  ✓ Logged in\n')

  // 2. Categories
  console.log('→ Creating categories...')
  const categoryMap = {}
  for (const cat of categories) {
    try {
      const res = await request('POST', '/api/categories', cat, token)
      const created = res.data ?? res
      categoryMap[cat.slug] = created.id
      console.log(`  ✓ Category: ${cat.name}`)
    } catch (e) {
      console.warn(`  ⚠ ${cat.name}: ${e.message}`)
    }
  }
  console.log()

  // 3. Authors
  console.log('→ Creating authors...')
  const authorMap = {}
  for (const author of authors) {
    try {
      const formData = new FormData()
      formData.append('name', author.name)
      formData.append('biography', author.biography)
      formData.append('social_links', JSON.stringify(author.social_links))

      const res = await fetch(`${BASE_URL}/api/authors`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(JSON.stringify(json))
      const created = json.data ?? json
      authorMap[author.name] = created.id
      console.log(`  ✓ Author: ${author.name}`)
    } catch (e) {
      console.warn(`  ⚠ ${author.name}: ${e.message}`)
    }
  }
  console.log()

  // 4. Books
  console.log('→ Creating books...')
  for (const book of books) {
    try {
      const authorId = authorMap[book.authorName]
      const categoryId = categoryMap[book.categorySlug]

      if (!authorId) throw new Error(`Author not found: ${book.authorName}`)
      if (!categoryId) throw new Error(`Category not found: ${book.categorySlug}`)

      const formData = new FormData()
      formData.append('title', book.title)
      formData.append('author_id', String(authorId))
      formData.append('category_id', String(categoryId))
      formData.append('isbn', book.isbn)
      formData.append('description', book.description)
      formData.append('price', String(book.price))
      formData.append('discount_price', String(book.discount_price))
      formData.append('stock_quantity', String(book.stock_quantity))
      formData.append('rating', String(book.rating))

      const res = await fetch(`${BASE_URL}/api/books`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(JSON.stringify(json))
      console.log(`  ✓ Book: ${book.title}`)
    } catch (e) {
      console.warn(`  ⚠ ${book.title}: ${e.message}`)
    }
  }

  console.log('\n✅ Seeding complete!')
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
