// Nothing on the website links to the app until Xan opens it: everyone joins and applies here.
export const LINKS = {
  join: '/#join',
  container: '/apply/container',
  facilitator: '/apply/facilitator',
  privacy: '/privacy',
  terms: '/terms',
  email: 'mailto:networkxanadu@gmail.com',
  instagram: 'https://instagram.com/dreamxanadu',
  facebook: 'https://facebook.com/dreamxanadu',
}

// The iridescent palette, in order around the logo's sheen
export const IRI = ['#9DBB7A', '#6FB7BF', '#8F9BE6', '#B58BE0', '#E09AC4', '#E8BF8A']

// Each landscape opens onto an imagined venue: a place where a community could live, practise and gather.
// Photos are free-licensed from Unsplash (unsplash.com/license) and served from their CDN.
export const LANDSCAPES = [
  { name: 'Beach', color: '#E6CDA6', photo: 'photo-1636619297905-54f124aa90b2', scene: 'Sunrise practice on the sand' },
  { name: 'Ocean', color: '#7FB3C2', photo: 'photo-1596178067639-5c6e68aea6dc', scene: 'A villa above the sea' },
  { name: 'Jungle', color: '#86A06A', photo: 'photo-1767334573989-ffa2720523b2', scene: 'A house in the canopy' },
  { name: 'Mountains', color: '#8C95C9', photo: 'photo-1587381420270-3e1a5b9e6904', scene: 'A cabin beneath the peaks' },
  { name: 'Desert', color: '#D9A67E', photo: 'photo-1725909632786-c25c9b2b5a16', scene: 'A tent under desert stars' },
  { name: 'Forest', color: '#6E9A7E', photo: 'photo-1568729937315-2ef5ee9cf4f2', scene: 'Woodsmoke among the pines' },
  { name: 'Countryside', color: '#B7B470', photo: 'photo-1608476037397-7b53ace4c871', scene: 'A villa among the cypress' },
  { name: 'Town', color: '#C8A0C4', photo: 'photo-1600818767171-fde3f6e1d275', scene: 'A village by the water' },
  { name: 'City', color: '#A58BD6', photo: 'photo-1740151571448-cdd459060f86', scene: 'Sunset above the city' },
]

/** An Unsplash photo at a given width, cropped and compressed for the web. */
export const photoUrl = (id, w = 1600, h) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=70`

export const PLACES = [
  { name: 'Colorado', lat: 39.5, lon: -105.8, side: 'right' },
  { name: 'California', lat: 36.8, lon: -119.4, side: 'left' },
  { name: 'Costa Rica', lat: 9.9, lon: -84.6 },
  { name: 'Peru', lat: -13.5, lon: -72.0 },
  { name: 'Argentina', lat: -34.6, lon: -58.4 },
  { name: 'Portugal', lat: 39.4, lon: -8.2 },
  { name: 'Bali', lat: -8.4, lon: 115.2 },
]
