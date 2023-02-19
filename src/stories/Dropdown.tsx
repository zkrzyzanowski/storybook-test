import { JSX } from "preact";
import { TW, tw, apply } from "twind";
import { SearchInput, SearchInputProps } from "./Input";
import { Component } from "./model";
import { Pill, PillChipColor, PillSize } from "./Pill";
import { SectionDivider } from "./SectionDivider";

export interface DropdownFooterActionProps {
  label: string;
  action: () => void;
}

type SingleDropdown = {
  __typename: "single";
  selectedOption: DropdownOption | undefined;
  setSelectedOption: (option: DropdownOption | undefined) => void;
};

type MultiDropdown = {
  __typename: "multiple";
  selectedOptions: DropdownOption[];
  setSelectedOptions: (options: DropdownOption[]) => void;
};

export type DropdownType = SingleDropdown | MultiDropdown;

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps extends Component {
  "aria-label"?: string;
  "data-testid"?: string;
  className?: string;
  placeholderContent?: JSX.Element;
  searchProps?: SearchInputProps;
  pillsSectionDividerTopText?: string;
  pillsSectionDividerBottomText?: string;
  options: DropdownOption[];
  primaryFooterButton?: DropdownFooterActionProps;
  secondaryFooterButton?: DropdownFooterActionProps;
  footerCallToAction?: DropdownFooterActionProps;
  dropdownType: DropdownType;
}

const Dropdown = ({
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
  className,
  searchProps,
  placeholderContent,
  pillsSectionDividerTopText = "",
  pillsSectionDividerBottomText = "",
  options,
  primaryFooterButton,
  secondaryFooterButton,
  footerCallToAction,
  dropdownType,
  tw: twProp = tw,
  ...rest
}: DropdownProps) => {
  const filteredOptions =
    searchProps && searchProps.value !== ""
      ? options.filter((o) =>
          o.label.toLowerCase().includes(`${searchProps.value}`.toLowerCase())
        )
      : options;

  return (
    <div
      {...rest}
      className={twProp(
        apply`flex flex-col app-body-md bg-white drop-shadow-medium rounded-md w-80 h-96`,
        className
      )}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      <div className={twProp(`flex flex-col flex-grow overflow-y-auto`)}>
        <div className={twProp(`px-4 pt-5`)}>
          {placeholderContent}

          {searchProps ? (
            <div className={twProp(`mb-4`)}>
              <SearchInput
                {...searchProps}
                data-testid={searchProps["data-testid"] ?? "dropdown-search"}
              />
            </div>
          ) : null}

          {isMultiSelect(dropdownType)
            ? viewMultiSelectSelected(
                twProp,
                dropdownType,
                pillsSectionDividerTopText,
                pillsSectionDividerBottomText,
                filteredOptions
              )
            : null}
        </div>

        {/* options */}
        {viewOptions(twProp, filteredOptions, dropdownType)}
      </div>
    </div>
  );
};

export type DropdownMultiSelectProps = Omit<DropdownProps, "dropdownType"> & {
  selectedOptions: DropdownOption[];
  setSelectedOptions: (options: DropdownOption[]) => void;
};

export const DropdownMultiSelect = (props: DropdownMultiSelectProps) => {
  const dropdownType: DropdownType = {
    __typename: "multiple",
    selectedOptions: props.selectedOptions,
    setSelectedOptions: props.setSelectedOptions,
  };

  return <Dropdown dropdownType={dropdownType} {...props} />;
};

export type DropdownSingleSelectProps = Omit<
  DropdownProps,
  | "dropdownType"
  | "pillsSectionDividerTopText"
  | "pillsSectionDividerBottomText"
> & {
  selectedOption: DropdownOption | undefined;
  setSelectedOption: (option: DropdownOption | undefined) => void;
};

export const DropdownSingleSelect = (props: DropdownSingleSelectProps) => {
  const dropdownType: DropdownType = {
    __typename: "single",
    selectedOption: props.selectedOption,
    setSelectedOption: props.setSelectedOption,
  };

  return <Dropdown dropdownType={dropdownType} {...props} />;
};

const viewMultiSelectSelected = (
  twProp: TW,
  dropdownType: MultiDropdown,
  pillsSectionDividerTopText: string,
  pillsSectionDividerBottomText: string,
  options: DropdownOption[]
) => {
  return (
    <>
      {dropdownType.selectedOptions.length > 0 ? (
        <div data-testid="selected-options-wrapper">
          <SectionDivider>
            <div data-testid="selected-options-top-divider">
              {dropdownType.selectedOptions.length +
                " " +
                pillsSectionDividerTopText}
            </div>
          </SectionDivider>

          <ul className={twProp(`flex flex-row flex-wrap gap-2`)}>
            {dropdownType.selectedOptions.map((s) => {
              return (
                <li data-testid="selected-option">
                  <Pill
                    label={s.label}
                    icon={<XOutlineIcon />}
                    chipColor={PillChipColor.LIGHT}
                    size={PillSize.MEDIUM}
                    onClick={() => removeSelectedOption(dropdownType, s.value)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <SectionDivider>
        <>{options.length + " " + pillsSectionDividerBottomText}</>
      </SectionDivider>
    </>
  );
};

const viewOptions = (
  twProp: TW,
  options: DropdownOption[],
  dropdownType: DropdownType
): JSX.Element => {
  return (
    <ul
      data-testid="available-options"
      className={twProp(`flex flex-col space-y-0.5`)}
    >
      {options.map((o) => {
        return (
          <li
            data-testid="available-option"
            key={o.value}
            className={twProp(
              `flex flex-row items-center justify-between cursor-pointer hover:(bg-gray-100) px-4 py-2.5 mr-4`,
              optionIsSelected(dropdownType, o) ? `bg-gray-100` : ""
            )}
            onClick={() => {
              if (!optionIsSelected(dropdownType, o)) {
                addSelectedOption(dropdownType, o);
              } else {
                removeSelectedOption(dropdownType, o.value);
              }
            }}
          >
            {o.label}
            {optionIsSelected(dropdownType, o) ? (
              <div
                data-testid={`${o.label}-option-checked-icon`}
                className={twProp("w-5")}
              >
                <CheckOutlineIcon />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

const isMultiSelect = (type: DropdownType): type is MultiDropdown => {
  return type.__typename === "multiple";
};

const removeSelectedOption = (
  dropdown: DropdownType,
  optionToRemove: string
): void => {
  if (isMultiSelect(dropdown)) {
    dropdown.setSelectedOptions(
      [...dropdown.selectedOptions].filter((o) => {
        return o.value !== optionToRemove;
      })
    );
  } else {
    dropdown.setSelectedOption(undefined);
  }
};

const addSelectedOption = (
  dropdown: DropdownType,
  optionToAdd: DropdownOption
): void => {
  if (isMultiSelect(dropdown)) {
    dropdown.setSelectedOptions([...dropdown.selectedOptions, optionToAdd]);
  } else {
    dropdown.setSelectedOption(optionToAdd);
  }
};

const optionIsSelected = (
  dropdown: DropdownType,
  option: DropdownOption
): boolean => {
  if (isMultiSelect(dropdown)) {
    return dropdown.selectedOptions.some((s) => s.value === option.value);
  }

  return dropdown.selectedOption?.value === option.value;
};

export const CheckOutlineIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M27 9.00073L13 23.0001L6 16.0007"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const XOutlineIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M25 7L7 25"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M25 25L7 7"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
