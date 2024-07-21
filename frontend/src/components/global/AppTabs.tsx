import React, { Dispatch, SetStateAction } from 'react'

interface AppTabsProps {
  activeIndex: number
  setActiveIndex: Dispatch<SetStateAction<number>>
  tabs: { id: number; title: string }[]
}

const AppTabs = ({ activeIndex, setActiveIndex, tabs }: AppTabsProps) => {
  return (
    <div className="bg-dark flex-row items-center justify-center overflow-x-scroll rounded-full px-2 py-2 md:overflow-x-hidden  max-w-fit">
      {tabs.map((tab, index) => (
        <button
          key={`${tab.id}${tab.title}`}
          onClick={() => setActiveIndex(index)}
          className={`px-4 py-2 ${
            index === activeIndex
              ? 'from-secondary/70 to-primary bg-gradient-to-r'
              : 'bg-gradient-to-r from-white to-gray-400  bg-clip-text text-transparent'
          } rounded-full`}
        >
          <p
            className={`${
              index === activeIndex ? 'text-white dark:text-white' : ''
            }`}
          >
            {tab.title}
          </p>
        </button>
      ))}
    </div>
  )
}

export default AppTabs
