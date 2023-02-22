import {
  DropdownMultiSelect,
  DropdownOption,
} from "../src/components/Dropdown";
import { useState } from "preact/hooks";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

export default {
  title: "Example/Dropdown",
  component: DropdownMultiSelect,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/preact/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    "data-testid": "test-dropdown",
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

export const SelectItemsPass = Template.bind({});

const waitForEvent = (delay: number = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

SelectItemsPass.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const dropdown = await canvas.findByTestId("test-dropdown");

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

  userEvent.click(availableOptions[1]);
  await waitForEvent();

  selectedOptions = await canvas.findAllByTestId("selected-option");
  await expect(selectedOptions).toHaveLength(2);

  const selectedOptionPill =
    selectedOptions[0].querySelector("svg") ?? new HTMLElement();

  await userEvent.click(selectedOptionPill);
  await waitForEvent();
  expect(await canvas.findAllByTestId("selected-option")).toHaveLength(1);

  await userEvent.click(availableOptions[1]);
  await waitForEvent();

  selectedOptions = canvas.queryAllByTestId("selected-option");
  expect(selectedOptions).toHaveLength(0);
};

export const SelectItemsFail = Template.bind({});

SelectItemsFail.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const dropdown = await canvas.findByTestId("test-dropdown");

  expect(dropdown).toBeVisible();

  expect(dropdown).toHaveTextContent("10 Options");

  const selectedOptionsWrapper = canvas.queryByTestId(
    "selected-options-wrapper"
  );
  expect(selectedOptionsWrapper).toBeNull();

  const availableOptions = await canvas.findAllByTestId("available-option");
  expect(availableOptions).toHaveLength(10);

  await waitFor(() => userEvent.click(availableOptions[0]), {
    timeout: 5000,
  });

  let selectedOptions = await canvas.findAllByTestId("selected-option");
  expect(selectedOptions).toHaveLength(1);

  await waitFor(() => userEvent.click(availableOptions[1]), {
    timeout: 5000,
  });

  selectedOptions = await canvas.findAllByTestId("selected-option");
  await expect(selectedOptions).toHaveLength(2);

  const selectedOptionPill =
    selectedOptions[0].querySelector("svg") ?? new HTMLElement();

  await userEvent.click(selectedOptionPill);
  expect(await canvas.findAllByTestId("selected-option")).toHaveLength(1);

  await userEvent.click(availableOptions[1]);

  selectedOptions = canvas.queryAllByTestId("selected-option");
  expect(selectedOptions).toHaveLength(0);
};
