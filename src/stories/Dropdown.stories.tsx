import { DropdownMultiSelect, DropdownOption } from "../components/Dropdown";
import { useState } from "preact/hooks";

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

export const Default = Template.bind({});
