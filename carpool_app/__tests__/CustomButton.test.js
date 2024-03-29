import renderer from "react-test-renderer";
import { render, fireEvent } from "@testing-library/react-native";
import CustomButton from "../components/CustomButton";

describe("CustomButton", () => {
  mockOnPress = jest.fn();

  it("displays the correct title", () => {
    const title = "Custom Title";
    const { getByText } = render(
      <CustomButton onPress={mockOnPress} title={title} />
    );
    expect(getByText(title)).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const { getByTestId } = render(
      <CustomButton onPress={mockOnPress} title={""} />
    );
    fireEvent.press(getByTestId("customButtonOpacity"));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
