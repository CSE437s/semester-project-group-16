import renderer from "react-test-renderer";
import { render, fireEvent } from "@testing-library/react-native";
import ChooseDate from "../components/ChooseDate";

describe("ChooseDate", () => {
  it("displays 2 DateTimePickers", () => {
    const mockSetDate = jest.fn();
    const testDate = new Date();
    const { getByTestId } = render(
      <ChooseDate date={testDate} setDate={mockSetDate} />
    );
    expect(getByTestId("datePicker")).toBeTruthy();
    expect(getByTestId("timePicker")).toBeTruthy();
  });
});
