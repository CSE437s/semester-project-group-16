import renderer from "react-test-renderer";
import { render, fireEvent } from "@testing-library/react-native";

jest.mock("../Utils", () => ({
  checkUserExists: jest
    .fn()
    .mockReturnValue(Promise.resolve({ uid: "12345", email: "a@gmail.com" })),
}));
import MapComponent, {
  getZoomDeltas,
  getMidpointCoordinate,
} from "../components/MapComponent";

//Need to mock certain functions from MapComponent
describe("MapComponent", () => {
  it("should always show a map view", () => {});
});

describe("getMidpointCoordinate", () => {
  it("should return (0,0) if no ride is specified", () => {
    const result = getMidpointCoordinate();
    expect(result).toEqual({ latitude: 0, longitude: 0 });
  });

  it("should return the midpoint between origin and destination coordinates", () => {
    const mockRide = {
      route: {
        originCoordinates: { latitude: 100, longitude: 100 },
        destinationCoordinates: { latitude: 200, longitude: 200 },
      },
      stops: [],
    };
    const result = getMidpointCoordinate(mockRide);
    expect(result).toEqual({ latitude: 150, longitude: 150 });
  });

  it("should return the midpoint between origin, destination, and stop coordinates", () => {
    const mockRide = {
      route: {
        originCoordinates: { latitude: 300, longitude: 210 },
        destinationCoordinates: { latitude: 200, longitude: 200 },
      },
      stops: [
        { stopCoordinates: { latitude: 140, longitude: 180 } },
        { stopCoordinates: { latitude: 150, longitude: 150 } },
      ],
    };
    const result = getMidpointCoordinate(mockRide);
    expect(result).toEqual({ latitude: 197.5, longitude: 185 });
  });
});

describe("getZoomDeltas", () => {
  const mockZoomDelta = 0.08;

  it("should return (0,0) if no ride is specified", () => {
    const result = getZoomDeltas();
    expect(result).toEqual({ latitudeDelta: 0, longitudeDelta: 0 });
  });

  it("should return the midpoint between origin and destination coordinates", () => {
    const mockRide = {
      route: {
        originCoordinates: { latitude: 100, longitude: 100 },
        destinationCoordinates: { latitude: 200, longitude: 200 },
      },
      stops: [],
    };
    const result = getZoomDeltas(mockRide, mockZoomDelta);
    expect(result).toEqual({ latitudeDelta: 180, longitudeDelta: 180 });
  });

  it("should return the midpoint between origin, destination, and stop coordinates", () => {
    const mockRide = {
      route: {
        originCoordinates: { latitude: 300, longitude: 210 },
        destinationCoordinates: { latitude: 200, longitude: 200 },
      },
      stops: [
        { stopCoordinates: { latitude: 140, longitude: 180 } },
        { stopCoordinates: { latitude: 150, longitude: 150 } },
      ],
    };
    const result = getZoomDeltas(mockRide, mockZoomDelta);
    expect(result).toEqual({ latitudeDelta: 288, longitudeDelta: 108 });
  });
});
