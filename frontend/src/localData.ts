export interface Product {
  id: number
  name: string
  manufacturer: {
    name: string
    country: string
  }
  price: number
  image: string
}

export const dummyProducts: Product[] = [
  {
    id: 1,
    name: 'EcoRide Pro',
    manufacturer: { name: 'EBikes', country: 'Kenya' },
    price: 450000,
    image: 'images/electric-bike-1.jpeg'
  },
  {
    id: 2,
    name: 'Urban Glider',
    manufacturer: { name: 'AfriWheels', country: 'Nigeria' },
    price: 420000,
    image: 'images/electric-bike-2.jpeg'
  },
  {
    id: 2,
    name: 'Urban Glider',
    manufacturer: { name: 'EWheels', country: 'Rwanda' },
    price: 420000,
    image: 'images/electric-bike-3.jpeg'
  },
  {
    id: 2,
    name: 'Urban Glider',
    manufacturer: { name: 'AfriRide', country: 'Ghana' },
    price: 420000,
    image: 'images/electric-bike-4.jpeg'
  }
  // Add 8 more dummy products here...
]
