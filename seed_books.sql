-- =============================================================
-- Vaalu Pathippagam - Sample Seed Data
-- Run against your PostgreSQL database:
--   psql -U <user> -d <dbname> -f seed_books.sql
-- =============================================================

-- ── Categories ───────────────────────────────────────────────
INSERT INTO categories (name, slug) VALUES
  ('சிறுவர் இலக்கியம்',   'siruvar-ilakkiyam'),
  ('கவிதை',                'kavithai'),
  ('வரலாறு',               'varalaru'),
  ('மருத்துவம்',            'maruthuvam'),
  ('சிறுகதை',              'sirugadhai')
ON CONFLICT (slug) DO NOTHING;

-- ── Authors ──────────────────────────────────────────────────
INSERT INTO authors (name, biography, photo, social_links) VALUES
  (
    'மோ.கணேசன்',
    'மோ.கணேசன் ஒரு சிறந்த தமிழ் எழுத்தாளர். கவிதை, சிறுகதை, கட்டுரை என பல இலக்கிய வடிவங்களில் ஆற்றல் மிக்கவர். வாலு பதிப்பகத்தின் முன்னணி படைப்பாளி.',
    'https://ui-avatars.com/api/?name=Mo+Ganesan&background=random',
    '{"facebook":"https://facebook.com","twitter":"https://twitter.com"}'
  ),
  (
    'ச.முத்துராமி',
    'ச.முத்துராமி தமிழ் இலக்கியத்தில் சிறப்பிடம் பெற்ற எழுத்தாளர். கல்வி சார்ந்த படைப்புகளில் விசேஷ ஆர்வம் கொண்டவர். பல்கலைக்கழக விரிவுரையாளராகவும் பணியாற்றியவர்.',
    'https://ui-avatars.com/api/?name=Sa+Muthurami&background=random',
    '{"website":"https://example.com"}'
  ),
  (
    'Dr. தெய்விகமணி',
    'Dr. தெய்விகமணி சித்த மருத்துவ நிபுணர். எளிய தமிழில் மருத்துவ அறிவை மக்களுக்கு எடுத்துச் செல்லும் படைப்பாளி. 20 ஆண்டுகளுக்கும் மேலான மருத்துவ அனுபவம் உடையவர்.',
    'https://ui-avatars.com/api/?name=Dr+Theivigamani&background=random',
    '{"instagram":"https://instagram.com"}'
  ),
  (
    'க.மாதேவன்',
    'க.மாதேவன் தமிழ் இலக்கியத்தில் ஆழமான சிந்தனையாளர். கவிதை மற்றும் கதை வடிவங்களில் தனித்துவமான குரல் கொண்டவர். தேசிய கவிதை விருது பெற்றவர்.',
    'https://ui-avatars.com/api/?name=Ka+Madhavan&background=random',
    '{"facebook":"https://facebook.com","instagram":"https://instagram.com"}'
  ),
  (
    'வாலு பதிப்பகம்',
    'வாலு பதிப்பகம் தமிழ் இலக்கியத்தை ஊக்குவிக்கும் ஒரு முன்னணி வெளியீட்டு நிறுவனம். புதிய படைப்பாளிகளை ஊக்குவித்து தமிழ் இலக்கியத்தை செழிப்படைய செய்கிறது.',
    'https://ui-avatars.com/api/?name=Vaalu+Pathippagam&background=random',
    '{"website":"https://vaalupathippagam.com","facebook":"https://facebook.com"}'
  )
ON CONFLICT DO NOTHING;

-- ── Books (10 Sample Books) ───────────────────────────────────
INSERT INTO books
  (title, author_id, category_id, isbn, description, price, discount_price, stock_quantity, cover_image, rating)
VALUES

(
  'குட்டித் தவளை கோபாலு - சிறுவர் பாடல்கள்',
  (SELECT id FROM authors WHERE name = 'வாலு பதிப்பகம்' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'siruvar-ilakkiyam' LIMIT 1),
  '9789388001001',
  'குழந்தைகளுக்கான அழகிய சிறுவர் பாடல்கள் தொகுப்பு. குட்டித் தவளை கோபாலுவின் கதையை பாடல் வடிவில் சொல்லும் மகிழ்வான நூல். குழந்தைகளின் மொழி வளர்ச்சிக்கும் கற்பனை திறனுக்கும் உதவும் படைப்பு.',
  120, 100, 50,
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
  4.5
),

(
  'காலை வண்ணக் காதல் கவிதைகள் - 100',
  (SELECT id FROM authors WHERE name = 'மோ.கணேசன்' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'kavithai' LIMIT 1),
  '9789388001002',
  'காலை வேளையில் மனதை மகிழ்விக்கும் 100 காதல் கவிதைகள். மோ.கணேசன் அவர்களின் இனிய கவிதை மொழி நம் மனதை நிறைக்கும். காதல், இயற்கை, வாழ்க்கை என பல்வேறு தலைப்புகளில் கவிதைகள் இடம்பெற்றுள்ளன.',
  150, 130, 40,
  'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop',
  4.6
),

(
  'அறிவும் அனுபவமும்',
  (SELECT id FROM authors WHERE name = 'மோ.கணேசன்' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'sirugadhai' LIMIT 1),
  '9789388001003',
  'வாழ்க்கையில் அறிவும் அனுபவமும் எவ்வாறு இணைந்து செயல்படுகின்றன என்பதை விளக்கும் சிந்தனை நூல். நடைமுறை வாழ்வில் கற்றுக்கொண்ட பாடங்களை கதை வடிவில் சொல்லும் தனித்துவமான படைப்பு.',
  160, 140, 35,
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
  4.4
),

(
  'இந்திய நிர்வாகம் குறித்த பொதுத்தகவல்',
  (SELECT id FROM authors WHERE name = 'ச.முத்துராமி' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'varalaru' LIMIT 1),
  '9789388001004',
  'இந்திய நிர்வாக அமைப்பு குறித்த தெளிவான, புரிந்துகொள்ளக்கூடிய வகையில் எழுதப்பட்ட பொதுத் தகவல் நூல். போட்டித் தேர்வுகளுக்கு தயாராவோருக்கு மிகவும் பயனுள்ள வழிகாட்டி.',
  200, 175, 30,
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
  4.3
),

(
  'இரு பக்க கதைகள்',
  (SELECT id FROM authors WHERE name = 'மோ.கணேசன்' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'sirugadhai' LIMIT 1),
  '9789388001005',
  'இரு பக்கங்களில் முழுமையான உணர்வை தரும் சிறுகதைகள் தொகுப்பு. மோ.கணேசனின் சிறப்பான கதை சொல்லும் திறன் காட்டும் நூல். வாழ்க்கையின் நுண்ணிய தருணங்களை பிடித்துவைக்கும் கதைகள்.',
  130, 110, 60,
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
  4.6
),

(
  'உணர்வில் சத்துகள்',
  (SELECT id FROM authors WHERE name = 'மோ.கணேசன்' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'kavithai' LIMIT 1),
  '9789388001006',
  'மனித உணர்வுகளை ஆழமாக பதிவு செய்யும் கவிதை தொகுப்பு. உள்ளத்தை நெகிழ்விக்கும் வரிகள். துயரம், மகிழ்ச்சி, தனிமை என்று வாழ்க்கையின் ஒவ்வொரு பரிமாணத்தையும் தொடும் கவிதைகள்.',
  140, 120, 50,
  'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=600&fit=crop',
  4.7
),

(
  'எளிய சித்த மருந்துகள் குறிப்புகள்',
  (SELECT id FROM authors WHERE name = 'Dr. தெய்விகமணி' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'maruthuvam' LIMIT 1),
  '9789388001007',
  'வீட்டிலேயே கடைபிடிக்கக்கூடிய எளிய சித்த மருத்துவ குறிப்புகள் தொகுப்பு. Dr. தெய்விகமணி அவர்களின் மருத்துவ அனுபவ வழிகாட்டல். பொதுவான நோய்களுக்கு இயற்கை வழி தீர்வுகள் அளிக்கும் நூல்.',
  220, 190, 60,
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
  4.8
),

(
  'ஒரு காயம் விடாது',
  (SELECT id FROM authors WHERE name = 'க.மாதேவன்' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'kavithai' LIMIT 1),
  '9789388001008',
  'உள்ளத்தில் தாக்கம் ஏற்படுத்தும் கவிதைகளின் தொகுப்பு. க.மாதேவன் அவர்களின் தனித்துவமான கவிதை உலகம். இழப்பு, நம்பிக்கை மற்றும் மீட்சி குறித்த ஆழமான உரையாடல்.',
  145, 125, 45,
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
  4.6
),

(
  'ஒரு பக்க கதைகள்',
  (SELECT id FROM authors WHERE name = 'மோ.கணேசன்' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'sirugadhai' LIMIT 1),
  '9789388001009',
  'ஒரே ஒரு பக்கத்தில் முழுமையான உலகை காட்டும் மினி கதைகள். மோ.கணேசனின் கதை சொல்லும் கலையின் உச்சம். ஒவ்வொரு கதையும் ஒரு சிறு திரைப்படம் போல் உணர்வை வழங்கும்.',
  120, 100, 70,
  'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop',
  4.8
),

(
  'கதை கதையாம் விடுகதையாம்',
  (SELECT id FROM authors WHERE name = 'வாலு பதிப்பகம்' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'siruvar-ilakkiyam' LIMIT 1),
  '9789388001010',
  'குழந்தைகளுக்கான கதைகளும் விடுகதைகளும் இணைந்த மகிழ்வான நூல். கற்பனை திறனை வளர்க்கும் படைப்பு. ஒவ்வொரு கதையிலும் ஒரு நீதியும், ஒவ்வொரு விடுகதையிலும் ஒரு சவாலும் உள்ளது.',
  110, 90, 80,
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=600&fit=crop',
  4.7
);
