import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Aos from 'aos'
import Home from './pages/Home'
import Welcome from 'pages/Welcome'
import './index.css'
import 'aos/dist/aos.css'

const App = () => {
  return (
    <>
      <Router>
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <div className="dark:bg-dark min-h-screen bg-gray-100 font-niveauGrotesk text-gray-500  dark:text-gray-400">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route
              path="*"
              element={
                <div className="flex h-screen items-center justify-center bg-gray-200">
                  <p className="text-center font-[rubik] text-2xl font-bold">
                    404 PAGE NOT FOUND
                  </p>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
