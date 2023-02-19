import { DropdownMultiSelect, DropdownOption } from "./Dropdown";
import { useState } from "preact/hooks";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

export default {
  title: "Example/Page",
  component: DropdownMultiSelect,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/preact/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    "data-testid": "fiber-dropdown",
    pillsSectionDividerTopText: "Selected",
    pillsSectionDividerBottomText: "Options",
    options: [
      { label: "Item 1", value: "1" },
      { label: "Item 2", value: "2" },
      { label: "Item 3", value: "3" },
      { label: "Item 4", value: "4" },
      { label: "Item 5", value: "5" },
      { label: "Item 6", value: "6" },
      { label: "Item 7", value: "7" },
      { label: "Item 8", value: "8" },
      { label: "Item 9", value: "9" },
      { label: "Item 10", value: "10" },
    ],
  },
};

const Template = (args) => {
  const [selected, setSelected] = useState<DropdownOption[]>([]);
  const [searchValue, setSearchValue] = useState("");

  return (
    <DropdownMultiSelect
      {...args}
      selectedOptions={selected}
      setSelectedOptions={(o: DropdownOption[]) => {
        setSelected(o);
      }}
      searchProps={{ value: searchValue, onChange: (s) => setSearchValue(s) }}
    />
  );
};

export const Default = Template.bind({});

export const SelectItems = Template.bind({});

SelectItems.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const dropdown = await canvas.findByTestId("fiber-dropdown");

  expect(dropdown).toBeVisible();

  expect(dropdown).toHaveTextContent("10 Options");

  const selectedOptionsWrapper = canvas.queryByTestId(
    "selected-options-wrapper"
  );
  expect(selectedOptionsWrapper).toBeNull();

  const availableOptions = await canvas.findAllByTestId("available-option");
  expect(availableOptions).toHaveLength(10);

  await userEvent.click(availableOptions[0]);

  let selectedOptions = await canvas.findAllByTestId("selected-option");
  expect(selectedOptions).toHaveLength(1);

  const updatedSelectedOptionsWrapper = await canvas.findByTestId(
    "selected-options-wrapper"
  );
  expect(updatedSelectedOptionsWrapper).toHaveTextContent("1 Selected");

  await userEvent.click(availableOptions[1]);

  expect(await canvas.findAllByTestId("selected-option")).toHaveLength(2);

  const selectedOptionPill =
    selectedOptions[0].querySelector("svg") ?? new HTMLElement();

  await userEvent.click(selectedOptionPill);
  expect(await canvas.findAllByTestId("selected-option")).toHaveLength(1);

  await userEvent.click(availableOptions[1]);

  selectedOptions = canvas.queryAllByTestId("selected-option");
  expect(selectedOptions).toHaveLength(0);
};
