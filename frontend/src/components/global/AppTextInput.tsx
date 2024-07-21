import React, {
  ComponentProps,
  FocusEvent,
  ReactElement,
  forwardRef,
  useState
} from 'react'

interface AppTextInputProps extends ComponentProps<'input'> {
  afterIcon?: ReactElement
  asSelect?: boolean
  beforeIcon?: ReactElement
  isForSearch?: boolean
  clearTextInput?: () => void
  customStyles?: string
  isPrimary?: boolean
  onPress?: () => void
}

const AppTextInput = forwardRef<HTMLInputElement, AppTextInputProps>(
  ({ onFocus, onBlur, ...otherProps }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
      setIsFocused(true)
      onFocus && onFocus(e)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
      setIsFocused(false)
      onBlur && onBlur(e)
    }

    return (
      <div className="relative mx-auto flex w-full items-center justify-center">
        <div
          className={`h-[50px] w-full rounded-md ${
            isFocused
              ? 'bg-gradient-to-r from-secondary to-primary'
              : 'bg-gray-400'
          } p-px border-[1.5px] border-transparent`}
        >
          <input
            ref={ref}
            className={`absolute z-80 rounded-md size-full -top-[0.15rem] left-0 bg-dark focus:border-b-primary h-[50px] p-3 focus:outline-none  ${
              otherProps.customStyles ? otherProps.customStyles : ''
            }`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...otherProps}
          />
        </div>
      </div>
    )
  }
)

AppTextInput.displayName = 'AppTextInput'

export default AppTextInput
