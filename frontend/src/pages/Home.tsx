import React, {
  useState
} from 'react'
import Header from 'components/global/Header'
import { IoCloseSharp } from 'react-icons/io5'
import NewChat from 'components/NewChat'

const Home = () => {
  const [latestAIResponse, setLatestAIResponse] = useState<AIResponse | null>(
    null
  )
  const [messages, setMessages] = useState<Message[]>([])

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
        <NewChat />

        {/* Side menu */}
      <div
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
      </div>
      </div>
    </main>
  )
}

export default Home
