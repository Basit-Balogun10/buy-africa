import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Logo from 'components/global/Logo'
import AppButton from 'components/global/AppButton'
import AppTextInput from 'components/global/AppTextInput'
import { IAccount, IUserFields, WelcomePageActiveViewIndex } from '../types'
import { getDataFromQueryParams } from '../helpers'

const Welcome = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const viewIndex = getDataFromQueryParams('view', location.search)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [OTP, setOTP] = useState('')
  const [OTPError, setOTPError] = useState('')
  const [registrationError, setRegistrationError] = useState('')
  const [resendCounter, setResendCounter] = useState(60) // 60 seconds
  const [isSendingOTP, setIsSendingOTP] = useState(false)
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false)
  const [isRegisteringUser, setIsRegisteringUser] = useState(false)
  const [OTPIsVerified, setOTPIsVerified] = useState(false)
  const [newAccountInfo, setNewAccountInfo] =
    useState<Partial<IAccount | null>>(null)
  const [activeViewIndex, setActiveViewIndex] = useState(
    Number(viewIndex) || WelcomePageActiveViewIndex.LOGIN
  )

  useEffect(() => {
    if (activeViewIndex === WelcomePageActiveViewIndex.VERIFY_AUTH_CODE) {
      if (resendCounter > 0 && !OTPIsVerified) {
        setTimeout(() => {
          setResendCounter(resendCounter - 1)
        }, 1000)
      }
    }
  }, [resendCounter, activeViewIndex, OTPIsVerified])

  const sendOTP = async (isResend: boolean = false) => {
    setIsSendingOTP(true)

    try {
      const response = await axios.post('api/v1/auth/send-otp', {
        email
      })

      if (response.status === 200) {
        console.log('SEND OTP RESPONSE: ', response.data)
        // notify user
        if (isResend) {
          setResendCounter(60)
          setOTP('')
          setOTPError('')
        }

        setActiveViewIndex(WelcomePageActiveViewIndex.VERIFY_AUTH_CODE)
      }
    } catch (error) {
      console.error('Unable to OTP: ', error)
      // notify user (based on isResend)
    } finally {
      setIsSendingOTP(false)
    }
  }

  const verifyOTP = async () => {
    setIsVerifyingOTP(true)

    try {
      const response = await axios.post(`/api/v1/auth/verify-otp`, {
        email,
        OTPFromUser: OTP
      })
      console.log('OTP Verification Response: ', response.data)

      if (response.status === 200 && response.data.success) {
        console.log('OTP verified successfully')

        const { isNewAccount, userProfile } = response.data

        if (isNewAccount) {
          setOTPIsVerified(true)
          console.log('User Profile: ', userProfile)
          setNewAccountInfo(userProfile)
        } else {
          console.log('User Profile: ', userProfile)
          localStorage.setItem('user', JSON.stringify(userProfile))
          navigate(`/`)
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error verifying OTP (axios): ', error.response?.data)
        setOTPError(error.response?.data?.message)
      } else {
        console.error('Error verifying OTP (not axios): ', error)
      }
    } finally {
      setIsVerifyingOTP(false)
    }
  }

  const registerUser = async () => {
    console.log('REGISTERING USER...')

    try {
      setIsRegisteringUser(true)

      console.log('New acc info: ', newAccountInfo)

      const userProfile = {
        baseProfile: {
          ...newAccountInfo,
          name
        } as IUserFields,
        profileByRole: {} as IUserFields
      }

      const response = await axios.post('api/v1/accounts', { ...userProfile })

      if (response.status === 201) {
        console.log('User Profile: ', response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
        navigate('/')
      } else {
        console.error('Error: ', response.data)
      }
    } catch (error) {
      console.error('Unable to register user: ', error)
      // notify user
      setRegistrationError(
        'We encountered an issue while completing your registration. Please try again later'
      )
    } finally {
      setIsRegisteringUser(false)
    }
  }

  const handleViewChange = (newViewIndex: WelcomePageActiveViewIndex) => {
    setActiveViewIndex(newViewIndex)
  }

  return (
    <main className="flex h-screen items-center">
      <div className="flex size-full ">
        {/* Left Section */}
        <div className="hidden h-full overflow-hidden bg-[linear-gradient(to_right_bottom,rgba(255,215,0,0.5),rgba(79,33,234,0.5)),url('/images/welcome-photo.webp')] md:block md:!w-3/5"></div>

        {/* Right Section */}
        <div className="m-auto mt-12 flex h-screen flex-col px-8 md:mt-0 md:w-2/5 md:justify-center">
          <div className="mb-3 flex items-center py-4">
            <Logo />
          </div>

          <>
            {OTPIsVerified ? (
              <div className="flex flex-col gap-4">
                <div className="items-center justify-between">
                  <h3 className="bg-gradient-to-r from-white via-gray-400 to-black bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
                    We are Almost There
                  </h3>
                </div>

                <p>What should we call you?</p>

                <div className="my-3 w-full space-y-3">
                  <AppTextInput
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex. John Doe"
                    value={name}
                  />
                  {registrationError && (
                    <p className="text-center text-red-400 dark:text-red-400/80 text-sm mt-2">
                      {registrationError}
                    </p>
                  )}

                  <AppButton
                    buttonText="Continue"
                    disabled={!name || isRegisteringUser}
                    isLoading={isRegisteringUser}
                    onClick={registerUser}
                  />
                </div>
              </div>
            ) : (
              <>
                {activeViewIndex === WelcomePageActiveViewIndex.LOGIN && (
                  <div className="flex flex-col gap-4">
                    <h3 className="bg-gradient-to-r from-white via-gray-400 to-black bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
                      Welcome to BuyAfrica
                    </h3>

                    <p>Get started with your email address</p>

                    <div className="my-3 w-full space-y-3">
                      <AppTextInput
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@xyz.com"
                      />

                      <AppButton
                        buttonText="Continue with Email"
                        disabled={isSendingOTP || !email}
                        isLoading={isSendingOTP}
                        onClick={sendOTP}
                      />
                    </div>
                  </div>
                )}

                {activeViewIndex ===
                  WelcomePageActiveViewIndex.VERIFY_AUTH_CODE && (
                  <div className="flex flex-col gap-4">
                    <div className="items-center justify-between">
                      <h3 className="bg-gradient-to-r from-white via-gray-400 to-black bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
                        Verify Your Email
                      </h3>
                    </div>

                    <p>Kindly enter the 6-digit code sent to {email}</p>

                    <div className="my-3 w-full space-y-3">
                      <AppTextInput
                        customStyles="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        autoFocus
                        maxLength={6}
                        onChange={(e) => setOTP(e.target.value)}
                        placeholder="X X X X X X"
                        type="number"
                        value={OTP}
                      />

                      {OTPError && (
                        <p className="text-center text-red-400 dark:text-red-400/80 text-sm mt-2">
                          {OTPError}
                        </p>
                      )}

                      <AppButton
                        buttonText="Let's Get Started"
                        disabled={isVerifyingOTP || !OTP}
                        isLoading={isVerifyingOTP}
                        onClick={verifyOTP}
                      />
                    </div>

                    <p className="text-center text-sm">
                      Didn&apos;t get the code?{' '}
                      <button
                        disabled={isSendingOTP || resendCounter > 0}
                        onClick={() => sendOTP(true)}
                        className={`text-primary font-bold hover:underline ${
                          isSendingOTP || resendCounter > 0 ? 'opacity-50' : ''
                        }`}
                      >
                        Resend {resendCounter > 0 ? `in ${resendCounter}s` : ''}
                      </button>
                    </p>

                    <button
                      onClick={() =>
                        handleViewChange(WelcomePageActiveViewIndex.LOGIN)
                      }
                      className="w-fit mx-auto from-primary via-primary to-secondary bg-gradient-to-r bg-clip-text font-bold text-transparent hover:scale-[1.01] transition-transform ease-in-out"
                    >
                      Use a different email
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </main>
  )
}

export default Welcome
