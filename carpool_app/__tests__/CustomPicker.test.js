import renderer from "react-test-renderer";
import { render, fireEvent } from "@testing-library/react-native";
import CustomPicker from "../components/CustomPicker";

//End-to-end tests are likely needed here

describe("CustomPicker", () => {
  const itemList = [
    { label: "Category 1", value: "Category 1" },
    { label: "Category 2", value: "Category 2" },
  ];
  it("should display the view", () => {
    const mockCategory = "Category 1";
    const mockSetCategory = jest.fn();
    const { getByTestId } = render(
      <CustomPicker
        category={mockCategory}
        setCategory={mockSetCategory}
        categoryItems={itemList}
      />
    );
    expect(getByTestId("customPickerView")).toBeTruthy();
  });
});
