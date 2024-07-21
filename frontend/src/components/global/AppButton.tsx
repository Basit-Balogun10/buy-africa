import React, { ComponentProps, ReactElement, forwardRef } from 'react'
import { ClipLoader } from 'react-spinners'

interface AppButtonProps extends ComponentProps<'button'> {
  bgColor?: string
  borderColor?: string
  borderWidth?: string
  buttonText: string
  disabled?: boolean
  customStyles?: string
  icon?: ReactElement
  isLoading?: boolean
  isPrimary?: boolean
  marginBottom?: string
  marginTop?: string
  onClick: () => void
  useDefault?: boolean
  width?: string
}

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (props, ref) => {
    const {
      buttonText,
      customStyles,
      icon,
      isLoading,
      isPrimary = true,
      ...nativeProps
    } = props

    return (
      <div className="mx-auto flex w-full items-center justify-center transition-transform ease-in-out hover:scale-[98%]">
        <div
          className={`h-[50px] w-full rounded-md bg-gradient-to-r ${
            isPrimary ? 'from-secondary/70' : 'from-secondary'
          } to-primary p-px`}
        >
          <button
            ref={ref}
            className={`
        h-full w-full flex items-center justify-center gap-x-2 rounded-md  ${
          isPrimary ? '' : 'dark:bg-dark bg-gray-100'
        } ${nativeProps.disabled ? 'opacity-30 dark:opacity-50' : ''}
 ${customStyles ? customStyles : ''}`}
            {...nativeProps}
          >
            {isLoading && (
              <ClipLoader
                color={'#FFF'}
                loading={isLoading}
                size={18}
                className=""
              />
            )}
            <span
              className={`${icon ? 'mr-1' : ''} ${
                isPrimary
                  ? 'dark:text-white text-white'
                  : 'from-primary via-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent'
              }`}
            >
              {buttonText}
            </span>
            {icon && !isLoading ? icon : null}
          </button>
        </div>
      </div>
    )
  }
)

AppButton.displayName = 'AppButton'

export default AppButton
