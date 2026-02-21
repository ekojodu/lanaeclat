// =============================================
// All environment variable access centralised here
// Vite uses import.meta.env — prefix vars with VITE_
// Set values in .env (copy from .env.example)
// =============================================

export const ENV = {
  businessName:       import.meta.env.VITE_BUSINESS_NAME      || 'Lana Eclat Beauty Studio',
  tagline:            import.meta.env.VITE_TAGLINE             || 'Because glowing skin is not a luxury—it\'s a lifestyle.',
  location:           import.meta.env.VITE_LOCATION            || 'Kabba, Kogi State, Nigeria',
  phone:              import.meta.env.VITE_PHONE               || '+234 000 000 0000',
  email:              import.meta.env.VITE_EMAIL               || 'hello@lanaeclat.com',
  instagram:          import.meta.env.VITE_INSTAGRAM           || '@lanaeclat',
  whatsapp:           import.meta.env.VITE_WHATSAPP            || '+234 000 000 0000',

  // Reservation
  reservationEmail:   import.meta.env.VITE_RESERVATION_EMAIL   || 'reservations@lanaeclat.com',
  reservationSubject: import.meta.env.VITE_RESERVATION_SUBJECT || 'Appointment Request - Lana Eclat Beauty Studio',

  // Maps
  googleMapsApiKey:   import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  mapLat:             parseFloat(import.meta.env.VITE_MAP_LAT  || '7.8256'),
  mapLng:             parseFloat(import.meta.env.VITE_MAP_LNG  || '6.0656'),
  mapZoom:            parseInt(import.meta.env.VITE_MAP_ZOOM   || '15', 10),

  // Social
  facebookUrl:        import.meta.env.VITE_FACEBOOK_URL        || '',
  tiktokUrl:          import.meta.env.VITE_TIKTOK_URL          || '',
};
