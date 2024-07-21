// Home.tsx
import React, { useState, useRef, useEffect } from 'react'
import Header from 'components/global/Header'
import AppButton from 'components/global/AppButton'
import { IoSendSharp, IoCloseSharp } from 'react-icons/io5'
import { BsCamera } from 'react-icons/bs'
import { dummyProducts, Product } from '../localData'
import ProductList from 'components/ProductsList'

const Home = () => {
  const [userInput, setUserInput] = useState('')
  const [isFetchingResponse, setIsFetchingResponse] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
  const imageData = useRef<string | ArrayBuffer | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        imageData.current = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    if (!isFetchingResponse) {
      imageData.current = null
    }
  }

  const startConversationWithAI = async () => {
    setIsFetchingResponse(true)
    setTimeout(() => {
      setIsFetchingResponse(false)
      setShowProducts(true)
    }, 3000)
  }

  return (
    <main className="relative flex flex-col items-start justify-center">
      <div className="w-full flex-col items-center justify-center">
        <div className="mb-12">
          <div className="mt-1">
            <Header />
          </div>
        </div>

        <div className="mx-auto size-full md:w-1/2 space-y-4 px-4">
          <h2 className="text-center text-4xl font-medium">
            Hello, My Favorite Human
          </h2>

          <div className="relative">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onClick={removeImage}
              name="userInput"
              type="text"
              placeholder={
                imageData.current ? '' : 'What are you buying today...?'
              }
              className={`w-full rounded-2xl border border-gray-300 py-4 pl-6 pr-24 outline-none transition-colors ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary/60 dark:border-secondary/70 dark:bg-dark dark:hover:border-secondary/80 ${
                isFetchingResponse ? 'cursor-not-allowed' : ''
              }`}
              disabled={isFetchingResponse}
            />
            {imageData.current && (
              <div className="group absolute left-[40%] top-1/2 -translate-y-1/2">
                <img
                  src={imageData.current as string}
                  alt="userInput"
                  className={`size-12 ${
                    isFetchingResponse
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer group-hover:opacity-50'
                  } rounded-lg`}
                  onClick={removeImage}
                />
                <IoCloseSharp
                  className={`absolute left-[30%] top-1/4 hidden ${
                    isFetchingResponse
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer group-hover:block'
                  } text-white`}
                  onClick={removeImage}
                  size={24}
                />
              </div>
            )}
            <div className="absolute h-12 right-4 top-1/2 flex -translate-y-1/2 space-x-2">
              <label
                className={`rounded-lg border px-3 py-3 dark:border-secondary/70 dark:bg-dark ${
                  isFetchingResponse
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }`}
                htmlFor="user-input-upload"
              >
                <BsCamera size={18} />
                <input
                  className="hidden"
                  id="user-input-upload"
                  name="userInput"
                  disabled={isFetchingResponse}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <AppButton
                buttonText="BuyAfrica"
                customStyles="px-4"
                onClick={startConversationWithAI}
                disabled={isFetchingResponse}
                isLoading={isFetchingResponse}
                icon={<IoSendSharp size={18} />}
              />
            </div>
          </div>
        </div>

        {showProducts && (
          <div className="px-14 mx-auto">
            <ProductList products={dummyProducts} />
          </div>
        )}
      </div>
    </main>
  )
}

export default Home
