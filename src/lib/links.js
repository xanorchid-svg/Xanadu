const APP = 'https://app.dreamxanadu.com'

export const LINKS = {
  app: APP,
  seeker: `${APP}/?mode=signup&role=Seeker`,
  container: `${APP}/?mode=signup&role=Container`,
  facilitator: `${APP}/?mode=signup&role=Facilitator`,
  signIn: `${APP}/`,
  privacy: `${APP}/privacy`,
  terms: `${APP}/terms`,
  email: 'mailto:networkxanadu@gmail.com',
  instagram: 'https://instagram.com/dreamxanadu',
  facebook: 'https://facebook.com/dreamxanadu',
}

// The iridescent palette, in order around the logo's sheen
export const IRI = ['#9DBB7A', '#6FB7BF', '#8F9BE6', '#B58BE0', '#E09AC4', '#E8BF8A']

export const LANDSCAPES = [
  { name: 'Beach', color: '#E6CDA6' },
  { name: 'Ocean', color: '#7FB3C2' },
  { name: 'Jungle', color: '#86A06A' },
  { name: 'Mountains', color: '#8C95C9' },
  { name: 'Desert', color: '#D9A67E' },
  { name: 'Forest', color: '#6E9A7E' },
  { name: 'Countryside', color: '#B7B470' },
  { name: 'Town', color: '#C8A0C4' },
  { name: 'City', color: '#A58BD6' },
]

export const PLACES = [
  { name: 'Colorado', lat: 39.5, lon: -105.8, side: 'right' },
  { name: 'California', lat: 36.8, lon: -119.4, side: 'left' },
  { name: 'Costa Rica', lat: 9.9, lon: -84.6 },
  { name: 'Peru', lat: -13.5, lon: -72.0 },
  { name: 'Buenos Aires', lat: -34.6, lon: -58.4 },
  { name: 'Portugal', lat: 39.4, lon: -8.2 },
  { name: 'Bali', lat: -8.4, lon: 115.2 },
]
