import { JSX } from "preact";
import { useRef, useState } from "react";
import { apply, tw } from "twind";
import { Component } from "./model";

export const SEARCH_INPUT_SIZE = ["sm", "md"] as const;

export type SearchInputSize = typeof SEARCH_INPUT_SIZE[number];

export interface SearchInputProps extends Component {
  "data-testid"?: string;
  size?: SearchInputSize;
  value: string;
  placeholder?: string;
  focused?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

export const SearchInput = ({
  "data-testid": dataTestId,
  size = "md",
  value = "",
  placeholder,
  onChange: onChangeProp,
  focused: focusedProp = false,
  className,
  tw: twProp = tw,
}: SearchInputProps) => {
  const [focused, setFocused] = useState(() => focusedProp);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) =>
    onChangeProp?.(e.currentTarget.value);
  const onFocus = () => setFocused(true);
  const onBlur = (e: JSX.TargetedFocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget && e.relatedTarget === buttonRef.current) {
      // Cancel blur event when clicked on clean button
      return;
    }
    setFocused(false);
  };
  const onClean = () => {
    onChangeProp?.("");
    setFocused(false);
  };

  const showClean = value !== "" && focused;

  return (
    <div
      data-testid={dataTestId}
      className={twProp(
        classes.root.default,
        classes.root.size[size],
        focused && classes.root.focused,
        className
      )}
    >
      <input
        data-testid="search-input"
        type="text"
        {...{ value, placeholder, onChange, onFocus, onBlur }}
        className={twProp(classes.input.default)}
      />
      {showClean && (
        <button
          data-testid="clear-search-button"
          ref={buttonRef}
          onClick={onClean}
          className={twProp(classes.icon.default, classes.icon.right)}
        >
          <XCircleOutlineIcon />
        </button>
      )}
    </div>
  );
};

const classes = {
  root: {
    default: apply`
        flex flex-row justify-between items-center px-3
        border border-surface-variant-light-outline rounded-md
        hover:(border-gray-900)
      `,
    focused: apply`
        border-gray-900
      `,
    size: {
      sm: apply`py-2.5`,
      md: apply`py-3.5`,
    },
  },
  input: {
    default: apply`
        flex-1 p-0
        border-none
        focus:ring-0
      `,
  },
  icon: {
    default: apply`w-5`,
    left: apply`mr-2 text-neutral-500`,
    right: apply`ml-3`,
  },
};

export const XCircleOutlineIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.996 12.5534 27.6251 9.24912 25.188 6.81201C22.7509 4.3749 19.4466 3.00398 16 3V3ZM20.707 19.293C20.8 19.3858 20.8739 19.496 20.9242 19.6174C20.9746 19.7387 21.0006 19.8688 21.0007 20.0002C21.0007 20.1316 20.9749 20.2617 20.9246 20.3832C20.8744 20.5046 20.8007 20.6149 20.7078 20.7078C20.6149 20.8007 20.5046 20.8744 20.3832 20.9246C20.2617 20.9749 20.1316 21.0007 20.0002 21.0006C19.8688 21.0006 19.7387 20.9746 19.6174 20.9242C19.496 20.8738 19.3858 20.8 19.293 20.707L16 17.4141L12.707 20.707C12.5195 20.8942 12.2652 20.9993 12.0002 20.9991C11.7352 20.999 11.4811 20.8937 11.2937 20.7063C11.1063 20.5189 11.001 20.2648 11.0009 19.9998C11.0007 19.7348 11.1058 19.4806 11.293 19.293L14.5859 16L11.293 12.707C11.1058 12.5194 11.0007 12.2652 11.0009 12.0002C11.001 11.7352 11.1063 11.4811 11.2937 11.2937C11.4811 11.1063 11.7352 11.001 12.0002 11.0009C12.2652 11.0007 12.5195 11.1058 12.707 11.293L16 14.5859L19.293 11.293C19.4806 11.1058 19.7348 11.0007 19.9998 11.0009C20.2648 11.001 20.5189 11.1063 20.7063 11.2937C20.8937 11.4811 20.999 11.7352 20.9991 12.0002C20.9993 12.2652 20.8942 12.5194 20.707 12.707L17.4141 16L20.707 19.293Z"
      fill="currentColor"
    />
  </svg>
);
