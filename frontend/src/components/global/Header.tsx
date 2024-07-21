import React, { Dispatch, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { IAccount } from '../../types'
import axios from 'axios'
import AppButton from './AppButton'

interface HeaderProps {
  setEventCreationModalIsActive?: Dispatch<SetStateAction<boolean>>
  setEventSubmissionModalIsActive?: Dispatch<SetStateAction<boolean>>
  user?: IAccount | null
}

const Header = ({
  setEventCreationModalIsActive,
  setEventSubmissionModalIsActive,
  user
}: HeaderProps) => {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = async () => {
    try {
      const response = await axios.delete('/api/v1/auth/logout')

      if (response.status === 204) {
        localStorage.removeItem('user')
        navigate('/welcome')
      }
    } catch (error) {
      console.error('Unable to log user out: ', error)
      window.alert(
        'We encountered an issue while logging you out. Please try again.'
      )
      // notify user
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex items-center justify-between mb-6 px-12 mt-6">
      <Logo />

      {user ? (
        <div className="flex md:w-[35%] items-center gap-x-8">
          <AppButton
            buttonText="Sign Out"
            isPrimary={false}
            disabled={isLoggingOut}
            isLoading={isLoggingOut}
            onClick={logout}
          />
        </div>
      ) : (
        <div className="flex md:w-[15%] items-center gap-x-8">
          {/* <AppButton
            buttonText="Register"
            disabled={isLoggingOut}
            isLoading={isLoggingOut}
            onClick={() => navigate(`/welcome`)}
          /> */}
        </div>
      )}
    </div>
  )
}

export default Header
