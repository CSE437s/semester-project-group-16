import CarInfoForm from "../components/CarInfoForm";
import { render, fireEvent } from "@testing-library/react-native";
import CustomAlert from "../components/CustomAlert";

describe("CustomAlert", () => {
  const mockOnClose = jest.fn();
  const testMessage = "Mock alert!";

  it("should display the message when visible is true", () => {
    const visible = true;
    const { getByText } = render(
      <CustomAlert
        visible={visible}
        message={testMessage}
        onClose={mockOnClose}
      />
    );
    expect(getByText(testMessage)).toBeTruthy();
  });

  it("should not display when visible is false", () => {
    const visible = false;
    const { queryByText } = render(
      <CustomAlert
        visible={visible}
        message={testMessage}
        onClose={mockOnClose}
      />
    );
    expect(queryByText(testMessage)).toBeFalsy();
  });

  it("should call onClose when close button is pressed", () => {
    const { getByTestId } = render(
      <CustomAlert visible={true} message={testMessage} onClose={mockOnClose} />
    );
    fireEvent.press(getByTestId("closeButton"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
