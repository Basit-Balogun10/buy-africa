import React, {
  useState,
  useRef,
  ChangeEvent,
  MouseEvent,
  useEffect
} from 'react'
import Header from 'components/global/Header'
import NewChat from 'components/NewChat'
import AppButton from 'components/global/AppButton'
import { IoSendSharp, IoCloseSharp } from 'react-icons/io5'
import { BsCamera } from 'react-icons/bs'
import { Message } from 'types'

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [sideMenuIsVisible, setSideMenuIsVisible] = useState(false)
  const [isFetchingResponse, setIsFetchingResponse] = useState(false)
  const imageData = useRef<string | ArrayBuffer | null>(null)
  const [userInput, setUserInput] = useState('')
  const { formData, setFormData } = useState({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0]
    setFormData({ ...formData, userInput: '' })

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

  const startConversationWithAI = async () => {}

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
            <Header />
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
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onClick={() => {
                imageData.current && removeImage()
              }}
              name="userInput"
              type="text"
              placeholder={
                imageData.current ? '' : 'What are you buying today...?'
              }
              className={`w-full rounded-2xl border border-gray-300 py-4 pl-6 pr-24 outline-none transition-colors ease-in-out focus:outline-none focus:ring-2  focus:ring-secondary/60 dark:border-secondary/70 dark:bg-dark dark:hover:border-secondary/80 ${
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

        {/* Side menu */}
        {/* <div
          className={`fixed left-0 top-0 h-screen w-full flex-col justify-center border-l-2 border-l-gray-700 px-6 shadow-lg shadow-black/30 transition-transform duration-300 md:flex md:w-1/5 dark:bg-gray-900 ${
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
        </div> */}
      </div>
    </main>
  )
}

export default Home
