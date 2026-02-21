# 🌸 Lana Éclat Beauty Studio — Website

A full React TypeScript website for Lana Éclat Beauty Studio, Kabba, Kogi State.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

Open `.env` and fill in your details:

```env
REACT_APP_BUSINESS_NAME="Lana Eclat Beauty Studio"
REACT_APP_PHONE="+234 XXX XXX XXXX"
REACT_APP_EMAIL="hello@lanaeclat.com"
REACT_APP_RESERVATION_EMAIL="reservations@lanaeclat.com"
REACT_APP_GOOGLE_MAPS_API_KEY="your-key-here"
# ...etc
```

### 3. Start the development server
```bash
npm start
```

### 4. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx / Navbar.css     → Sticky animated navbar
│   ├── Footer.tsx / Footer.css     → Full footer with links
│   └── Cursor.tsx                  → Custom rose-pink cursor
├── pages/
│   ├── Home.tsx / Home.css         → Hero, services preview, why-us, CTA
│   ├── About.tsx / About.css       → Story, values, team, mission
│   ├── Services.tsx / Services.css → Accordion treatments list
│   ├── Gallery.tsx / Gallery.css   → Filterable grid + lightbox
│   └── Contact.tsx / Contact.css   → Reservation form + map
├── data/
│   └── treatments.ts               → All 7 facial treatments data
├── config/
│   └── env.ts                      → All env variable access point
├── hooks/
│   └── useScrollReveal.ts          → Scroll-based reveal animations
└── styles/
    └── globals.css                 → Design tokens, animations, utilities
```

---

## 🔧 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_BUSINESS_NAME` | Studio name | Yes |
| `REACT_APP_TAGLINE` | Hero tagline | Yes |
| `REACT_APP_LOCATION` | Physical address | Yes |
| `REACT_APP_PHONE` | Contact phone | Yes |
| `REACT_APP_EMAIL` | General email | Yes |
| `REACT_APP_INSTAGRAM` | Instagram handle (e.g. @lanaeclat) | No |
| `REACT_APP_WHATSAPP` | WhatsApp number | No |
| `REACT_APP_RESERVATION_EMAIL` | Email that receives bookings | Yes |
| `REACT_APP_RESERVATION_SUBJECT` | Booking email subject prefix | Yes |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps Embed API key | No* |
| `REACT_APP_MAP_LAT` | Business latitude | Yes |
| `REACT_APP_MAP_LNG` | Business longitude | Yes |
| `REACT_APP_MAP_ZOOM` | Map zoom level (1-20) | Yes |
| `REACT_APP_FACEBOOK_URL` | Facebook page URL | No |
| `REACT_APP_TIKTOK_URL` | TikTok profile URL | No |

*Map works without API key but with limited features.

---

## 🗺️ Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable **Maps Embed API**
3. Create API credentials → Copy key → Paste into `.env`

---

## ✉️ How Reservations Work

When a client fills in the booking form and clicks **Send Reservation Request**, the site:
1. Builds a pre-formatted email with all their details
2. Opens the user's email client (Gmail, Outlook, etc.)
3. The email is addressed to `REACT_APP_RESERVATION_EMAIL`
4. Client clicks **Send** to confirm

This is plug-and-play — no backend needed.

---

## 🖼️ Adding Real Photos to Gallery

Edit `src/pages/Gallery.tsx` and update the `galleryItems` array. Replace the emoji + gradient placeholders with real `<img>` tags or hosted image URLs:

```tsx
const galleryItems = [
  {
    id: 1,
    imageUrl: 'https://your-cdn.com/photo1.jpg',
    label: 'Deep Cleansing Session',
    cat: 'treatments',
  },
  // ...
];
```

---

## 🎨 Design System

| Token | Value | Use |
|-------|-------|-----|
| `--rose-deep` | `#9b2f52` | Primary brand color |
| `--rose-mid` | `#c8537a` | Accents, buttons |
| `--rose-blush` | `#f5c5d0` | Light backgrounds |
| `--gold` | `#d4a84b` | Premium highlights |
| `--font-serif` | Cormorant Garamond | Headings |
| `--font-sans` | Jost | Body text |

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, services preview, first-time offer |
| About | `/about` | Studio story, values, team |
| Services | `/services` | Accordion of all 7 treatments |
| Gallery | `/gallery` | Filterable grid with lightbox |
| Contact | `/contact` | Reservation form + WhatsApp + map |

---

Built with ♥ for Lana Éclat Beauty Studio, Kabba, Kogi State.
