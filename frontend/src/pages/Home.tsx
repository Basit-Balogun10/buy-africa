import React, {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { BsCamera } from 'react-icons/bs'
import { IoIosOptions } from 'react-icons/io'
import { IoSendSharp, IoCloseSharp, IoChevronDown } from 'react-icons/io5'
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa6'
import AppButton from 'components/AppButton'
import localData from 'cache'
import { capitalizeString, isMobile } from 'utils'
import Header from 'components/global/Header'

const Home = () => {
  const [isFetchingResponse, setIsFetchingResponse] = useState(false)
  const [latestAIResponse, setLatestAIResponse] = useState<AIResponse | null>(
    null
  )
  const [messages, setMessages] = useState<Message[]>([])
  const imageData = useRef<string | ArrayBuffer | null>(null)

  const cachedMeals = [
    'fried puff puff',
    'shawarma',
    'jam doughnut',
    'milky doughnut'
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0]
    setFormData({ ...formData, meal: '' })

    if (file) {
      const reader = new FileReader()

      reader.onloadend = async () => {
        const base64Data = reader.result

        if (base64Data) {
          imageData.current = base64Data
          await startConversationWithAI()
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    if (!isFetchingResponse) {
      imageData.current = null
    }
  }

  return (
    <main className="relative flex flex-col items-start justify-center">
      <div
        className={`my-auto ${
          sideMenuIsVisible ? 'md:w-2/3' : 'w-full'
        } flex-col items-center justify-center transition-[width] ease-in-out`}
      >
        {/* A. Topmost section */}
        <div className="mb-12">
          {/* Logo */}
          <div className="mt-1">
            <Header
            />
          </div>
        </div>

        {/* B. Next section */}
        <div
          className={`mx-auto size-full ${
            sideMenuIsVisible ? 'md:w-3/4' : 'md:w-1/2'
          } space-y-4 px-4 transition-[width] ease-in-out`}
        >
          {/* Greeting */}
          <h2 className="text-center text-4xl font-medium">
            Hello, My Favorite Human
          </h2>

          {/* Input section */}
          <div className="relative">
            <input
              value={formData?.meal || ''}
              onChange={handleFormChange}
              onClick={() => {
                imageData.current && removeImage()
              }}
              name="meal"
              type="text"
              placeholder={imageData.current ? '' : 'Feed me that junk'}
              className={`w-full rounded-2xl border border-gray-300 py-4 pl-6 pr-24 outline-none transition-colors ease-in-out focus:outline-none focus:ring-2  focus:ring-teal-700 dark:border-teal-800 dark:bg-gray-800 dark:hover:border-teal-700 ${
                isFetchingResponse ? 'cursor-not-allowed' : ''
              }`}
              disabled={isFetchingResponse}
            />
            {imageData.current && (
              <div className="group absolute left-[40%] top-1/2 -translate-y-1/2">
                <img
                  src={imageData.current as string}
                  alt="meal"
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
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 space-x-2">
              <label
                className={`rounded-lg border px-3 py-3 dark:border-teal-900/80 dark:bg-gray-900 ${
                  isFetchingResponse
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }`}
                htmlFor="meal-upload"
              >
                <BsCamera size={18} />
                <input
                  className="hidden"
                  id="meal-upload"
                  name="meal"
                  disabled={isFetchingResponse}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <AppButton
                buttonText="healthALT"
                onClick={startConversationWithAI}
                disabled={isFetchingResponse}
                isLoading={isFetchingResponse}
                icon={<IoSendSharp size={18} />}
              />
            </div>
          </div>
        </div>

        {/* Side menu */}
      <div
        className={`fixed left-0 top-0 h-screen w-full flex-col justify-center border-l-2 border-l-gray-700 px-6 shadow-lg shadow-black/30 transition-transform duration-300 md:flex md:w-1/3 dark:bg-gray-900 ${
          sideMenuIsVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end">
          <button
            onClick={() => setSideMenuIsVisible(false)}
            className="rounded-full p-2 transition-colors ease-in-out dark:hover:bg-gray-800"
          >
            <IoCloseSharp size={24} className="text-teal-500" />
          </button>
        </div>
      </div>
      </div>
    </main>
  )
}

export default Home
