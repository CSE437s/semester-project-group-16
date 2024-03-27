import CarInfoForm from "../components/CarInfoForm";
import { render, fireEvent } from "@testing-library/react-native";
import ChooseDate from "../components/ChooseDate";

describe("CarInfoForm", () => {
  it("renders five textInput components", () => {
    mockOnVehicleInfoChange = jest.fn();
    const { getByTestId } = render(
      <CarInfoForm onVehicleInfoChange={mockOnVehicleInfoChange} />
    );

    expect(getByTestId("vehicleMakeInput")).toBeTruthy();
    expect(getByTestId("vehicleModelInput")).toBeTruthy();
    expect(getByTestId("vehicleYearInput")).toBeTruthy();
    expect(getByTestId("vehicleLicensePlateInput")).toBeTruthy();
    expect(getByTestId("vehicleSeatInput")).toBeTruthy();
  });
});

describe("CarInfoForm Input Changes", () => {
  const mockOnVehicleInfoChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls onVehicleInfoChange when vehicleMakeInput changes", () => {
    const { getByTestId } = render(
      <CarInfoForm onVehicleInfoChange={mockOnVehicleInfoChange} />
    );
    fireEvent.changeText(getByTestId("vehicleMakeInput"), "Toyota");
    expect(mockOnVehicleInfoChange).toHaveBeenCalled();
  });

  it("calls onVehicleInfoChange when vehicleModelInput changes", () => {
    const { getByTestId } = render(
      <CarInfoForm onVehicleInfoChange={mockOnVehicleInfoChange} />
    );
    fireEvent.changeText(getByTestId("vehicleModelInput"), "Camry");
    expect(mockOnVehicleInfoChange).toHaveBeenCalled();
  });

  it("calls onVehicleInfoChange when vehicleYearInput changes", () => {
    const { getByTestId } = render(
      <CarInfoForm onVehicleInfoChange={mockOnVehicleInfoChange} />
    );
    fireEvent.changeText(getByTestId("vehicleYearInput"), "2022");
    expect(mockOnVehicleInfoChange).toHaveBeenCalled();
  });

  it("calls onVehicleInfoChange when vehicleLicensePlateInput changes", () => {
    const { getByTestId } = render(
      <CarInfoForm onVehicleInfoChange={mockOnVehicleInfoChange} />
    );
    fireEvent.changeText(getByTestId("vehicleLicensePlateInput"), "ABC123");
    expect(mockOnVehicleInfoChange).toHaveBeenCalled();
  });

  it("calls onVehicleInfoChange when vehicleSeatInput changes", () => {
    const { getByTestId } = render(
      <CarInfoForm onVehicleInfoChange={mockOnVehicleInfoChange} />
    );
    fireEvent.changeText(getByTestId("vehicleSeatInput"), "5");
    expect(mockOnVehicleInfoChange).toHaveBeenCalled();
  });
});
