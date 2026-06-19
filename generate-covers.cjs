const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, 'src', 'assets', 'images', 'covers')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

// ── Per-category colour themes ────────────────────────────────
const themes = {
  siruvar:  { bg1:'#C2410C', bg2:'#EA580C', bg3:'#FCD34D', panel:'#7C1D06', accent:'#FDE68A', gold:'#FCD34D', star:'#FCD34D' },
  kavithai: { bg1:'#4C1D95', bg2:'#7C3AED', bg3:'#C026D3', panel:'#2E1065', accent:'#E9D5FF', gold:'#F0ABFC', star:'#F0ABFC' },
  kavithai2:{ bg1:'#831843', bg2:'#BE185D', bg3:'#E11D48', panel:'#500724', accent:'#FBCFE8', gold:'#F9A8D4', star:'#F9A8D4' },
  history:  { bg1:'#0F172A', bg2:'#1E3A8A', bg3:'#1D4ED8', panel:'#0A0F1E', accent:'#BFDBFE', gold:'#FCD34D', star:'#FCD34D' },
  medicine: { bg1:'#052E16', bg2:'#14532D', bg3:'#166534', panel:'#022C16', accent:'#BBF7D0', gold:'#4ADE80', star:'#4ADE80' },
  general:  { bg1:'#083344', bg2:'#155E75', bg3:'#0E7490', panel:'#041C24', accent:'#A5F3FC', gold:'#22D3EE', star:'#22D3EE' },
}

// ── Reusable decorative parts ─────────────────────────────────
function border(accent) {
  return `
  <rect x="10" y="10" width="280" height="400" rx="3" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.5"/>
  <rect x="14" y="14" width="272" height="392" rx="2" fill="none" stroke="${accent}" stroke-width="0.5" opacity="0.3"/>
  <circle cx="10" cy="10" r="3" fill="${accent}" opacity="0.6"/>
  <circle cx="290" cy="10" r="3" fill="${accent}" opacity="0.6"/>
  <circle cx="10" cy="410" r="3" fill="${accent}" opacity="0.6"/>
  <circle cx="290" cy="410" r="3" fill="${accent}" opacity="0.6"/>
  <line x1="10" y1="26" x2="30" y2="26" stroke="${accent}" stroke-width="1" opacity="0.5"/>
  <line x1="270" y1="26" x2="290" y2="26" stroke="${accent}" stroke-width="1" opacity="0.5"/>
  <line x1="10" y1="394" x2="30" y2="394" stroke="${accent}" stroke-width="1" opacity="0.5"/>
  <line x1="270" y1="394" x2="290" y2="394" stroke="${accent}" stroke-width="1" opacity="0.5"/>`
}

function starsRating(rating, x, y, color) {
  const full = Math.floor(rating), half = (rating - full) >= 0.5
  let out = ''
  for (let i = 0; i < 5; i++) {
    const sx = x + i * 18
    const fill = i < full ? color : (i === full && half ? color : 'none')
    const stroke = color
    out += `<polygon points="${sx},${y} ${sx+4.5},${y+3} ${sx+7},${y} ${sx+5},${y+5} ${sx+8},${y+8} ${sx+4.5},${y+7} ${sx+1},${y+8} ${sx+2},${y+5}" fill="${fill}" stroke="${stroke}" stroke-width="0.8" opacity="0.9"/>`
  }
  return out
}

function titleText(title, t, startY) {
  // split into lines of max ~13 chars (Tamil chars are wide)
  const words = title.split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    const try_ = cur ? cur + ' ' + w : w
    if (try_.length > 13 && cur) { lines.push(cur); cur = w }
    else cur = try_
    if (lines.length === 2) { lines.push(words.slice(words.indexOf(w)).join(' ')); break }
  }
  if (cur && lines.length < 3) lines.push(cur)
  const lh = 34
  return lines.map((ln, i) =>
    `<text x="150" y="${startY + i * lh}" text-anchor="middle" font-size="21" font-weight="bold" fill="white" letter-spacing="0.5" filter="url(#ts)">${ln}</text>`
  ).join('\n  ')
}

// ── Category badge ────────────────────────────────────────────
function badge(label, gold) {
  const w = label.length * 9 + 20
  return `
  <rect x="18" y="18" width="${w}" height="24" rx="12" fill="rgba(0,0,0,0.5)"/>
  <text x="28" y="35" font-size="10.5" fill="${gold}" font-weight="600" letter-spacing="0.8">${label}</text>`
}

// ── Illustration: Children ────────────────────────────────────
function illus_children() {
  return `
  <!-- sky -->
  <circle cx="150" cy="105" r="68" fill="rgba(255,230,0,0.18)"/>
  <!-- sun -->
  <circle cx="150" cy="105" r="46" fill="rgba(255,215,0,0.85)"/>
  <circle cx="150" cy="105" r="36" fill="rgba(255,235,100,0.9)"/>
  <!-- sun rays -->
  ${[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{
    const r=a*Math.PI/180, x1=150+52*Math.cos(r), y1=105+52*Math.sin(r), x2=150+68*Math.cos(r), y2=105+68*Math.sin(r)
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(255,210,0,0.7)" stroke-width="3" stroke-linecap="round"/>`
  }).join('')}
  <!-- clouds -->
  <ellipse cx="60" cy="75" rx="30" ry="16" fill="rgba(255,255,255,0.7)"/>
  <ellipse cx="80" cy="68" rx="22" ry="14" fill="rgba(255,255,255,0.75)"/>
  <ellipse cx="230" cy="80" rx="28" ry="15" fill="rgba(255,255,255,0.65)"/>
  <ellipse cx="248" cy="73" rx="20" ry="12" fill="rgba(255,255,255,0.7)"/>
  <!-- birds -->
  <path d="M48,50 Q55,44 62,50" stroke="rgba(255,255,255,0.9)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M68,58 Q75,52 82,58" stroke="rgba(255,255,255,0.9)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M210,48 Q217,42 224,48" stroke="rgba(255,255,255,0.9)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- rolling hills -->
  <path d="M0,170 Q75,130 150,160 Q225,185 300,150 L300,200 L0,200 Z" fill="rgba(0,100,0,0.25)"/>
  <!-- stars -->
  <text x="28" y="132" font-size="14" fill="rgba(255,255,255,0.8)">✦</text>
  <text x="260" y="118" font-size="11" fill="rgba(255,255,255,0.7)">✦</text>
  <text x="240" y="145" font-size="9" fill="rgba(255,255,255,0.6)">✦</text>
  <text x="40" y="155" font-size="9" fill="rgba(255,255,255,0.6)">✦</text>`
}

// ── Illustration: Moon-poetry ─────────────────────────────────
function illus_moon() {
  return `
  <!-- glow -->
  <circle cx="160" cy="100" r="75" fill="rgba(255,255,255,0.05)"/>
  <!-- full moon -->
  <circle cx="160" cy="100" r="55" fill="rgba(255,248,200,0.25)"/>
  <!-- crescent -->
  <circle cx="160" cy="100" r="48" fill="rgba(255,245,180,0.7)"/>
  <circle cx="178" cy="92" r="40" fill="#6B21A8"/>
  <!-- stars scattered -->
  ${[[45,40],[80,30],[210,45],[250,35],[270,70],[30,80],[22,110],[260,110],[48,140],[270,140]].map(([x,y],i)=>`
  <circle cx="${x}" cy="${y}" r="${1.5+i%2}" fill="white" opacity="${0.5+0.4*(i%3)}"/>`).join('')}
  <!-- lotus at bottom -->
  <ellipse cx="150" cy="178" rx="18" ry="8" fill="rgba(255,200,220,0.6)"/>
  <path d="M132,178 Q150,155 168,178" fill="rgba(255,180,210,0.5)"/>
  <path d="M136,178 Q150,162 164,178" fill="rgba(255,200,225,0.7)"/>
  <path d="M140,178 Q150,168 160,178" fill="rgba(255,220,235,0.9)"/>
  <!-- shooting star -->
  <line x1="220" y1="50" x2="250" y2="30" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="220" cy="50" r="2" fill="white" opacity="0.8"/>`
}

// ── Illustration: Rose-poetry ─────────────────────────────────
function illus_rose() {
  return `
  <!-- glow circles -->
  <circle cx="150" cy="105" r="80" fill="rgba(255,100,150,0.08)"/>
  <circle cx="150" cy="105" r="55" fill="rgba(255,80,130,0.07)"/>
  <!-- rose petals (simplified) -->
  <ellipse cx="150" cy="90" rx="28" ry="40" fill="rgba(220,50,100,0.7)" transform="rotate(-15,150,90)"/>
  <ellipse cx="165" cy="100" rx="26" ry="38" fill="rgba(200,40,90,0.7)" transform="rotate(20,165,100)"/>
  <ellipse cx="135" cy="100" rx="26" ry="38" fill="rgba(230,60,110,0.65)" transform="rotate(-20,135,100)"/>
  <ellipse cx="150" cy="115" rx="24" ry="35" fill="rgba(240,70,120,0.65)"/>
  <!-- centre -->
  <circle cx="150" cy="100" r="16" fill="rgba(255,100,140,0.9)"/>
  <circle cx="150" cy="100" r="9" fill="rgba(255,150,170,0.8)"/>
  <!-- leaves -->
  <ellipse cx="110" cy="145" rx="20" ry="10" fill="rgba(20,140,60,0.6)" transform="rotate(-30,110,145)"/>
  <ellipse cx="190" cy="145" rx="20" ry="10" fill="rgba(20,140,60,0.6)" transform="rotate(30,190,145)"/>
  <!-- stem -->
  <line x1="150" y1="135" x2="150" y2="185" stroke="rgba(30,120,30,0.6)" stroke-width="3"/>
  <!-- hearts -->
  <text x="50"  y="70" font-size="16" fill="rgba(255,150,180,0.6)">♥</text>
  <text x="235" y="80" font-size="13" fill="rgba(255,150,180,0.5)">♥</text>
  <text x="40"  y="150" font-size="11" fill="rgba(255,150,180,0.4)">♥</text>`
}

// ── Illustration: Library/History ────────────────────────────
function illus_library() {
  return `
  <!-- pillars -->
  <rect x="55" y="60" width="22" height="130" fill="rgba(255,210,0,0.25)" rx="2"/>
  <rect x="139" y="45" width="22" height="145" fill="rgba(255,210,0,0.3)" rx="2"/>
  <rect x="223" y="60" width="22" height="130" fill="rgba(255,210,0,0.25)" rx="2"/>
  <!-- pillar caps -->
  <rect x="48" y="55" width="36" height="10" fill="rgba(255,210,0,0.35)" rx="1"/>
  <rect x="132" y="38" width="36" height="10" fill="rgba(255,210,0,0.40)" rx="1"/>
  <rect x="216" y="55" width="36" height="10" fill="rgba(255,210,0,0.35)" rx="1"/>
  <!-- arch between centre pillars -->
  <path d="M68,80 Q150,20 232,80" stroke="rgba(255,210,0,0.4)" stroke-width="2.5" fill="none"/>
  <!-- book silhouettes on shelf -->
  <rect x="72" y="135" width="14" height="40" fill="rgba(255,210,0,0.3)" rx="1"/>
  <rect x="88" y="128" width="12" height="47" fill="rgba(255,200,50,0.25)" rx="1"/>
  <rect x="102" y="133" width="15" height="42" fill="rgba(255,210,0,0.28)" rx="1"/>
  <rect x="163" y="130" width="13" height="45" fill="rgba(255,210,0,0.28)" rx="1"/>
  <rect x="178" y="125" width="14" height="50" fill="rgba(255,210,0,0.3)" rx="1"/>
  <rect x="194" y="132" width="12" height="43" fill="rgba(255,200,50,0.25)" rx="1"/>
  <!-- shelf line -->
  <rect x="50" y="175" width="200" height="4" fill="rgba(255,210,0,0.3)" rx="1"/>
  <!-- stars -->
  <text x="140" y="78" font-size="14" fill="rgba(255,210,0,0.6)">✦</text>
  <text x="28"  y="100" font-size="10" fill="rgba(255,210,0,0.4)">✦</text>
  <text x="260" y="95" font-size="10" fill="rgba(255,210,0,0.4)">✦</text>`
}

// ── Illustration: Open books / fair ──────────────────────────
function illus_bookfair() {
  return `
  <!-- stacked books -->
  <!-- bottom stack -->
  <rect x="40" y="155" width="80" height="14" rx="2" fill="rgba(255,200,0,0.5)"/>
  <rect x="44" y="142" width="74" height="14" rx="2" fill="rgba(255,160,0,0.45)"/>
  <rect x="48" y="129" width="66" height="14" rx="2" fill="rgba(255,200,0,0.4)"/>
  <rect x="52" y="116" width="58" height="14" rx="2" fill="rgba(255,180,0,0.4)"/>
  <!-- right stack -->
  <rect x="180" y="155" width="80" height="14" rx="2" fill="rgba(100,180,255,0.45)"/>
  <rect x="184" y="142" width="74" height="14" rx="2" fill="rgba(80,160,255,0.4)"/>
  <rect x="188" y="129" width="66" height="14" rx="2" fill="rgba(100,180,255,0.4)"/>
  <!-- open book centre -->
  <path d="M90,170 Q150,140 210,170 L210,185 Q150,158 90,185 Z" fill="rgba(255,255,255,0.18)"/>
  <path d="M150,140 L150,185" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  <!-- quill pen -->
  <path d="M240,50 Q220,90 230,130 Q225,120 215,115 Q228,100 220,85 Q240,60 240,50Z" fill="rgba(255,255,200,0.5)"/>
  <line x1="230" y1="130" x2="222" y2="150" stroke="rgba(255,255,200,0.4)" stroke-width="1.5"/>
  <!-- sparkles -->
  <text x="40"  y="70" font-size="16" fill="rgba(255,210,0,0.6)">✦</text>
  <text x="256" y="60" font-size="12" fill="rgba(255,210,0,0.5)">✦</text>
  <text x="130" y="55" font-size="10" fill="rgba(255,210,0,0.5)">✦</text>
  <text x="22"  y="130" font-size="8"  fill="rgba(255,210,0,0.4)">✦</text>`
}

// ── Illustration: Anniversary / 12 ───────────────────────────
function illus_anniv() {
  return `
  <!-- decorative wreath circle -->
  <circle cx="150" cy="105" r="72" fill="none" stroke="rgba(255,210,0,0.25)" stroke-width="2"/>
  <circle cx="150" cy="105" r="62" fill="none" stroke="rgba(255,210,0,0.18)" stroke-width="1"/>
  <!-- laurel leaves around circle (simplified) -->
  ${Array.from({length:16},(_,i)=>{
    const a=i*22.5*Math.PI/180, cx=150+68*Math.cos(a), cy=105+68*Math.sin(a)
    return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="7" ry="4" fill="rgba(60,180,60,0.45)" transform="rotate(${(i*22.5+90).toFixed(0)},${cx.toFixed(1)},${cy.toFixed(1)})"/>`
  }).join('')}
  <!-- "12" numeral -->
  <text x="150" y="130" text-anchor="middle" font-size="70" font-weight="900" fill="rgba(255,210,0,0.25)" letter-spacing="-4">12</text>
  <text x="150" y="128" text-anchor="middle" font-size="68" font-weight="900" fill="rgba(255,210,0,0.45)" letter-spacing="-4">12</text>
  <!-- small stars around -->
  <text x="72" y="55" font-size="12" fill="rgba(255,210,0,0.6)">✦</text>
  <text x="220" y="55" font-size="12" fill="rgba(255,210,0,0.6)">✦</text>
  <text x="40" y="115" font-size="10" fill="rgba(255,210,0,0.5)">✦</text>
  <text x="255" y="115" font-size="10" fill="rgba(255,210,0,0.5)">✦</text>
  <text x="150" y="44" font-size="10" fill="rgba(255,210,0,0.5)">✦</text>`
}

// ── Illustration: Abstract wave / modern poetry ───────────────
function illus_wave() {
  return `
  <!-- layered waves -->
  <path d="M0,80 Q75,40 150,80 Q225,120 300,80 L300,105 Q225,145 150,105 Q75,65 0,105 Z" fill="rgba(200,80,255,0.2)"/>
  <path d="M0,100 Q75,60 150,100 Q225,140 300,100 L300,125 Q225,165 150,125 Q75,85 0,125 Z" fill="rgba(180,60,240,0.18)"/>
  <path d="M0,120 Q75,80 150,120 Q225,160 300,120 L300,145 Q225,185 150,145 Q75,105 0,145 Z" fill="rgba(160,40,220,0.15)"/>
  <path d="M0,140 Q75,100 150,140 Q225,180 300,140 L300,165 Q225,205 150,165 Q75,125 0,165 Z" fill="rgba(140,20,200,0.12)"/>
  <!-- circle moon -->
  <circle cx="150" cy="65" r="40" fill="rgba(200,120,255,0.25)"/>
  <circle cx="150" cy="65" r="28" fill="rgba(220,150,255,0.3)"/>
  <circle cx="150" cy="65" r="16" fill="rgba(240,180,255,0.35)"/>
  <!-- scattered stars -->
  ${[[30,35],[260,30],[50,150],[250,155],[150,175]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="rgba(220,180,255,0.7)"/>`).join('')}
  <text x="22"  y="60" font-size="12" fill="rgba(220,180,255,0.6)">✦</text>
  <text x="268" y="65" font-size="10" fill="rgba(220,180,255,0.6)">✦</text>`
}

// ── Illustration: Healing / Medicine ─────────────────────────
function illus_medicine() {
  return `
  <!-- caduceus cross -->
  <rect x="141" y="40" width="18" height="110" rx="4" fill="rgba(80,220,120,0.35)"/>
  <rect x="100" y="75" width="100" height="18" rx="4" fill="rgba(80,220,120,0.35)"/>
  <!-- lotus petals -->
  <ellipse cx="150" cy="160" rx="40" ry="16" fill="rgba(100,220,140,0.3)"/>
  <path d="M110,160 Q150,128 190,160" fill="rgba(80,200,120,0.25)"/>
  <path d="M118,160 Q150,135 182,160" fill="rgba(100,220,140,0.3)"/>
  <path d="M128,160 Q150,142 172,160" fill="rgba(130,240,160,0.4)"/>
  <path d="M138,160 Q150,150 162,160" fill="rgba(160,255,180,0.55)"/>
  <!-- green sparkling dots -->
  ${[[42,50],[258,55],[30,130],[268,135],[65,175],[235,175]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="rgba(80,220,120,0.5)"/>`).join('')}
  <!-- leaf sprigs -->
  <ellipse cx="68" cy="90" rx="18" ry="9" fill="rgba(40,160,80,0.4)" transform="rotate(-40,68,90)"/>
  <ellipse cx="232" cy="90" rx="18" ry="9" fill="rgba(40,160,80,0.4)" transform="rotate(40,232,90)"/>
  <line x1="68"  y1="90"  x2="55"  y2="75"  stroke="rgba(40,160,80,0.4)" stroke-width="1.5"/>
  <line x1="232" y1="90"  x2="245" y2="75"  stroke="rgba(40,160,80,0.4)" stroke-width="1.5"/>
  <text x="38"  y="48" font-size="12" fill="rgba(80,220,120,0.6)">✦</text>
  <text x="256" y="50" font-size="12" fill="rgba(80,220,120,0.6)">✦</text>`
}

// ── Illustration: Mandala / Knowledge ────────────────────────
function illus_mandala() {
  const rings = [60, 48, 36, 24, 12]
  const petals = rings.map((r, ri) => {
    const n = 8 + ri * 2
    return Array.from({length: n}, (_, i) => {
      const a = i * 360 / n * Math.PI / 180
      return `<ellipse cx="${(150+r*Math.cos(a)).toFixed(1)}" cy="${(105+r*Math.sin(a)).toFixed(1)}" rx="${4-ri*0.3}" ry="${2-ri*0.1}" fill="rgba(34,211,238,${0.15+ri*0.06})" transform="rotate(${(i*360/n).toFixed(1)},${(150+r*Math.cos(a)).toFixed(1)},${(105+r*Math.sin(a)).toFixed(1)})"/>`
    }).join('')
  }).join('')
  return `
  <!-- outer glow rings -->
  <circle cx="150" cy="105" r="78" fill="none" stroke="rgba(34,211,238,0.12)" stroke-width="1.5"/>
  <circle cx="150" cy="105" r="68" fill="none" stroke="rgba(34,211,238,0.15)" stroke-width="1"/>
  <circle cx="150" cy="105" r="58" fill="none" stroke="rgba(34,211,238,0.18)" stroke-width="1"/>
  <!-- mandala petals -->
  ${petals}
  <!-- centre -->
  <circle cx="150" cy="105" r="10" fill="rgba(34,211,238,0.5)"/>
  <circle cx="150" cy="105" r="5" fill="rgba(200,250,255,0.8)"/>
  <!-- cross lines -->
  <line x1="150" y1="30"  x2="150" y2="180" stroke="rgba(34,211,238,0.15)" stroke-width="1"/>
  <line x1="75"  y1="105" x2="225" y2="105" stroke="rgba(34,211,238,0.15)" stroke-width="1"/>
  <line x1="96"  y1="51"  x2="204" y2="159" stroke="rgba(34,211,238,0.10)" stroke-width="1"/>
  <line x1="204" y1="51"  x2="96"  y2="159" stroke="rgba(34,211,238,0.10)" stroke-width="1"/>
  <text x="22" y="55" font-size="12" fill="rgba(34,211,238,0.5)">✦</text>
  <text x="264" y="60" font-size="10" fill="rgba(34,211,238,0.5)">✦</text>`
}

// ── Grand-parent / child theme ────────────────────────────────
function illus_grandchild() {
  return `
  <!-- warm sunset sky -->
  <circle cx="150" cy="80" r="70" fill="rgba(255,200,80,0.15)"/>
  <!-- two figures (grandparent + child silhouette) -->
  <!-- grandparent -->
  <circle cx="110" cy="108" r="14" fill="rgba(255,200,100,0.5)"/>
  <path d="M96,122 Q98,160 110,165 Q122,160 124,122 Q118,118 110,118 Q102,118 96,122Z" fill="rgba(255,190,80,0.45)"/>
  <!-- walking stick -->
  <line x1="96" y1="130" x2="82" y2="170" stroke="rgba(200,150,60,0.5)" stroke-width="2.5" stroke-linecap="round"/>
  <!-- child -->
  <circle cx="180" cy="118" r="10" fill="rgba(255,210,120,0.55)"/>
  <path d="M170,128 Q172,155 180,158 Q188,155 190,128 Q185,124 180,124 Q175,124 170,128Z" fill="rgba(255,200,100,0.5)"/>
  <!-- connecting hand line -->
  <path d="M124,138 Q152,145 170,138" stroke="rgba(255,200,100,0.4)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- ground -->
  <path d="M0,170 Q75,160 150,170 Q225,180 300,165 L300,190 L0,190Z" fill="rgba(60,120,20,0.2)"/>
  <!-- sun -->
  <circle cx="150" cy="55" r="28" fill="rgba(255,200,0,0.5)"/>
  <circle cx="150" cy="55" r="20" fill="rgba(255,220,80,0.6)"/>
  ${[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180,x1=150+30*Math.cos(r),y1=55+30*Math.sin(r),x2=150+40*Math.cos(r),y2=55+40*Math.sin(r);return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(255,200,0,0.5)" stroke-width="2" stroke-linecap="round"/>`}).join('')}
  <text x="32"  y="70" font-size="12" fill="rgba(255,200,80,0.6)">✦</text>
  <text x="258" y="65" font-size="10" fill="rgba(255,200,80,0.6)">✦</text>`
}

// ── Book definitions ──────────────────────────────────────────
const books = [
  { id:1,  title:'குட்டி தவளை கோபாரு - சிறுவர் பாடல்கள்', cat:'சிறுவர் இலக்கியம்', theme:themes.siruvar,   isbn:'9789388001001', rating:4.5, illus:illus_children()  },
  { id:2,  title:'காலை வணக்கம் காதல் கவிதைகள்',           cat:'கவிதை',            theme:themes.kavithai,  isbn:'9789388001002', rating:4.6, illus:illus_moon()       },
  { id:3,  title:'கோவை பேரியார் அறிவுலக நூலகத்தில்',      cat:'வரலாறு & நிகழ்வு', theme:themes.history,   isbn:'9789388001003', rating:4.4, illus:illus_library()    },
  { id:4,  title:'2026 சென்னை சர்வதேசப் புத்தகக்காட்சியில் வாரு', cat:'வரலாறு & நிகழ்வு', theme:themes.history, isbn:'9789388001004', rating:4.3, illus:illus_bookfair() },
  { id:5,  title:'சென்னை சர்வதேசப் புத்தகக்காட்சியில் 12', cat:'வரலாறு & நிகழ்வு', theme:themes.history,   isbn:'9789388001005', rating:4.3, illus:illus_anniv()     },
  { id:6,  title:'தங்கமே எனக்கே செல்லிரோய் - கவிதை',      cat:'கவிதை',            theme:themes.kavithai2, isbn:'9789388001006', rating:4.7, illus:illus_rose()       },
  { id:7,  title:'வாழ்வில் பொருள் - பொது அறிவு கேள்வி',   cat:'பொது அறிவு',       theme:themes.general,   isbn:'9789388001007', rating:4.5, illus:illus_mandala()    },
  { id:8,  title:'விடக்கேற்று விளைகள் - கவிதை தொகுப்பு',  cat:'கவிதை',            theme:themes.kavithai,  isbn:'9789388001008', rating:4.4, illus:illus_wave()       },
  { id:9,  title:'பேரன் நந்தும் பேரதோக் காப்பு',           cat:'சிறுவர் இலக்கியம்', theme:themes.siruvar,  isbn:'9789388001009', rating:4.6, illus:illus_grandchild() },
  { id:10, title:'எளிய சித்த மருத்துவம் குறிப்புகள்',     cat:'மருத்துவம்',        theme:themes.medicine,  isbn:'9789388001010', rating:4.8, illus:illus_medicine()   },
]

// ── SVG builder ───────────────────────────────────────────────
function buildCover(b) {
  const {theme: t, illus, title, cat, isbn, rating} = b
  const titleLines = (() => {
    const words = title.split(' '), lines = []
    let cur = ''
    for (const w of words) {
      const try_ = cur ? cur + ' ' + w : w
      if (try_.length > 13 && cur) { lines.push(cur); cur = w; if (lines.length === 2) { lines.push(words.slice(words.indexOf(w)).join(' ')); break } }
      else cur = try_
    }
    if (cur && lines.length < 3) lines.push(cur)
    return lines.slice(0, 3)
  })()
  const lh = 32, titleY = lines => 232 - (lines - 1) * lh / 2
  const ty = titleY(titleLines.length)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" width="300" height="420">
<defs>
  <linearGradient id="bg" x1="0%" y1="0%" x2="60%" y2="100%">
    <stop offset="0%"   stop-color="${t.bg1}"/>
    <stop offset="55%"  stop-color="${t.bg2}"/>
    <stop offset="100%" stop-color="${t.bg3}"/>
  </linearGradient>
  <linearGradient id="panel" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%"   stop-color="${t.panel}" stop-opacity="0.82"/>
    <stop offset="100%" stop-color="${t.panel}" stop-opacity="0.96"/>
  </linearGradient>
  <linearGradient id="bottombar" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%"   stop-color="${t.panel}" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="${t.panel}" stop-opacity="1"/>
  </linearGradient>
  <filter id="ts" x="-5%" y="-5%" width="110%" height="110%">
    <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.8)"/>
  </filter>
  <filter id="glow">
    <feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <style>text { font-family:'Noto Serif Tamil','Noto Sans Tamil','Latha','Tamil MN',serif; }</style>
</defs>

<!-- background -->
<rect width="300" height="420" fill="url(#bg)"/>

<!-- illustration area (top) -->
${illus}

<!-- text panel -->
<rect x="0" y="195" width="300" height="225" fill="url(#panel)"/>

<!-- decorative border -->
${border(t.gold)}

<!-- category badge -->
${badge(cat, t.gold)}

<!-- publisher top-right -->
<text x="282" y="35" text-anchor="end" font-size="9.5" fill="${t.accent}" opacity="0.65" letter-spacing="0.5">வாலு பதிப்பகம்</text>

<!-- thin gold line separator -->
<line x1="30" y1="202" x2="270" y2="202" stroke="${t.gold}" stroke-width="0.8" opacity="0.4"/>

<!-- title -->
${titleLines.map((ln,i)=>`<text x="150" y="${ty+i*lh}" text-anchor="middle" font-size="21" font-weight="bold" fill="white" letter-spacing="0.4" filter="url(#ts)">${ln}</text>`).join('\n')}

<!-- ornamental divider -->
<g opacity="0.6">
  <line x1="55"  y1="${ty+titleLines.length*lh+10}" x2="120" y2="${ty+titleLines.length*lh+10}" stroke="${t.gold}" stroke-width="0.8"/>
  <circle cx="150" cy="${ty+titleLines.length*lh+10}" r="3" fill="${t.gold}"/>
  <line x1="180" y1="${ty+titleLines.length*lh+10}" x2="245" y2="${ty+titleLines.length*lh+10}" stroke="${t.gold}" stroke-width="0.8"/>
</g>

<!-- publisher name below divider -->
<text x="150" y="${ty+titleLines.length*lh+28}" text-anchor="middle" font-size="12.5" fill="${t.accent}" letter-spacing="1.5" opacity="0.85">வாலு பதிப்பகம்</text>

<!-- star rating -->
${starsRating(rating, 150 - 5*9, ty+titleLines.length*lh+52, t.star)}
<text x="${150+5*9+6}" y="${ty+titleLines.length*lh+61}" font-size="11" fill="${t.accent}" opacity="0.8">${rating.toFixed(1)}</text>

<!-- bottom bar -->
<rect x="0" y="393" width="300" height="27" fill="url(#bottombar)"/>
<line x1="0" y1="393" x2="300" y2="393" stroke="${t.gold}" stroke-width="0.6" opacity="0.4"/>
<text x="18"  y="411" font-size="9.5" fill="${t.accent}" opacity="0.5">ISBN ${isbn}</text>
<text x="282" y="411" font-size="9.5" fill="${t.accent}" opacity="0.5" text-anchor="end">vaalu.in</text>
</svg>`
}

for (const b of books) {
  fs.writeFileSync(path.join(outDir, `book-${b.id}.svg`), buildCover(b), 'utf8')
  console.log(`✅  book-${b.id}.svg`)
}
console.log(`\nDone → src/assets/images/covers/`)
