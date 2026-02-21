/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUSINESS_NAME: string
  readonly VITE_TAGLINE: string
  readonly VITE_LOCATION: string
  readonly VITE_PHONE: string
  readonly VITE_EMAIL: string
  readonly VITE_INSTAGRAM: string
  readonly VITE_WHATSAPP: string
  readonly VITE_RESERVATION_EMAIL: string
  readonly VITE_RESERVATION_SUBJECT: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_MAP_LAT: string
  readonly VITE_MAP_LNG: string
  readonly VITE_MAP_ZOOM: string
  readonly VITE_FACEBOOK_URL: string
  readonly VITE_TIKTOK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
