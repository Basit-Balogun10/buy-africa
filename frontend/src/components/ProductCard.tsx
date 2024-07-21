// ProductCard.tsx
import React from 'react'
import { Product } from './dummyData'
import AppButton from './global/AppButton'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleBuy = async () => {
    try {
      const response = await fetch(
        '/api/v1/third-party/paystack/payment-link',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount: product.price })
        }
      )
      const data = await response.json()
      console.log('response: ', response)
      window.open('https://paystack.com/pay/j12kpbuvhr', '_blank')
    } catch (error) {
      console.error('Error creating payment link:', error)
    }
  }

  return (
    <div className="flex flex-col rounded-lg border border-dark bg-dark shadow-md overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.manufacturer.name}</p>
            <p className="text-xs text-gray-500">
              {product.manufacturer.country}
            </p>
          </div>
          <p className="text-lg font-bold">₦{product.price.toLocaleString()}</p>
        </div>
        <AppButton onClick={handleBuy} buttonText="Buy Now" />
      </div>
    </div>
  )
}

export default ProductCard
