import Logo from 'components/Logo'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GuestUserRole, IAccount, WelcomePageActiveViewIndex } from '../types'
import { useNavigate, useLocation } from 'react-router-dom'
import AppButton from 'components/AppButton'
import AppTextInput from 'components/AppTextInput'
import { getDataFromQueryParams } from '../helpers'

const Welcome = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const viewIndex = getDataFromQueryParams('view', location.search)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [OTP, setOTP] = useState('')
  const [eventCode, setEventCode] = useState('')
  const [OTPError, setOTPError] = useState('')
  const [eventCodeError, setEventCodeError] = useState('')
  const [registrationError, setRegistrationError] = useState('')
  const [guestUserRole, setGuestUserRole] = useState<GuestUserRole | null>(null)
  const [resendCounter, setResendCounter] = useState(60) // 60 seconds
  const [isSendingOTP, setIsSendingOTP] = useState(false)
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false)
  const [isVerifyingEventCode, setIsVerifyingEventCode] = useState(false)
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
      // noitify user (based on isResend)
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

        const { isNewAccount, account } = response.data

        if (isNewAccount) {
          setOTPIsVerified(true)
          console.log('Account: ', account)
          setNewAccountInfo(account)
        } else {
          console.log('user: ', account)
          localStorage.setItem('user', JSON.stringify(account))
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
    console.log('REGISTERING USER')
    try {
      setIsRegisteringUser(true)

      console.log('New acc info: ', newAccountInfo)

      const accountInfo = {
        ...newAccountInfo,
        name
      }
      const response = await axios.post('api/v1/accounts', { accountInfo })

      if (response.status === 201) {
        console.log('user: ', response.data.account)
        localStorage.setItem('user', JSON.stringify(response.data.account))
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

  const verifyEventCode = async () => {
    setIsVerifyingEventCode(true)

    try {
      const response = await axios.get(
        `api/v1/events/event?eventCode=${eventCode}&guestUserRole=${guestUserRole}`
      )

      if (response.status === 200) {
        // notify user
        localStorage.setItem(
          'guestUserData',
          JSON.stringify({
            eventCode: eventCode,
            eventId: response.data._id,
            role: guestUserRole
          })
        )

        if (guestUserRole === GuestUserRole.JUDGE) {
          navigate(`/leaderboard/${response.data._id}`)
        } else if (guestUserRole === GuestUserRole.PARTICIPANT) {
          navigate(`/leaderboard/${response.data._id}?asLeaderboard=true`)
        }
      } else {
        setEventCodeError(
          'We could not find an event with the code you provided'
        )
        // notify user
      }
    } catch (error) {
      console.error('Unable to verify event code: ', error)
      setEventCodeError(
        'We encountered an issue while verifying your event code. Please try again later'
      )
      // notify user
    } finally {
      setIsVerifyingEventCode(false)
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
                      Welcome to HaTchBoard
                    </h3>

                    <p>
                      Host and manage your hackathon and pitch events with ease.
                    </p>

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

                    <p className="text-center text-sm">
                      Looking to join an event? Join{' '}
                      <button
                        onClick={() => {
                          setGuestUserRole(GuestUserRole.JUDGE)
                          handleViewChange(
                            WelcomePageActiveViewIndex.JOIN_EVENT
                          )
                        }}
                        className="text-primary font-bold hover:underline"
                      >
                        as a judge
                      </button>{' '}
                      OR{' '}
                      <button
                        onClick={() => {
                          setGuestUserRole(GuestUserRole.PARTICIPANT)
                          handleViewChange(
                            WelcomePageActiveViewIndex.JOIN_EVENT
                          )
                        }}
                        className="text-primary font-bold hover:underline"
                      >
                        a participant
                      </button>
                    </p>
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

                {activeViewIndex === WelcomePageActiveViewIndex.JOIN_EVENT && (
                  <div className="flex flex-col gap-4">
                    <div className="items-center justify-between">
                      <h3 className="bg-gradient-to-r from-white via-gray-400 to-black bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
                        {guestUserRole === GuestUserRole.JUDGE
                          ? 'Enter Your Unique Code'
                          : 'Enter Event Code'}
                      </h3>
                    </div>

                    <p>
                      {guestUserRole === GuestUserRole.JUDGE
                        ? 'Enter the unique 6-digit code sent to your email to join in'
                        : 'Enter your event code below to join in'}
                    </p>

                    <div className="my-3 w-full space-y-3">
                      <AppTextInput
                        customStyles="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        autoFocus
                        maxLength={6}
                        onChange={(e) => setEventCode(e.target.value)}
                        placeholder="X X X X X X"
                        type="number"
                        value={eventCode}
                      />
                      {eventCodeError && (
                        <p className="text-center text-red-400 dark:text-red-400/80 text-sm mt-2">
                          {eventCodeError}
                        </p>
                      )}

                      <AppButton
                        buttonText="Let me Inside"
                        disabled={isVerifyingEventCode || !eventCode}
                        isLoading={isVerifyingEventCode}
                        onClick={verifyEventCode}
                      />
                    </div>

                    <div className="flex items-center justify-center space-x-1">
                      <p>How about you</p>
                      <button
                        onClick={() =>
                          handleViewChange(WelcomePageActiveViewIndex.LOGIN)
                        }
                        className="w-fit mx-auto from-primary via-primary to-secondary bg-gradient-to-r bg-clip-text font-bold text-transparent hover:scale-[1.01] transition-transform ease-in-out"
                      >
                        host an event?
                      </button>
                    </div>
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
