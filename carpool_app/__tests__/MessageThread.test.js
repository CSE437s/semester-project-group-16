import renderer from "react-test-renderer";
import { render, fireEvent } from "@testing-library/react-native";
import MessageThread from "../components/MessageThread";

jest.mock("../Utils", () => ({
  fetchRideRequests: jest.fn().mockResolvedValue([{ outgoingUserId: "1234" }]),
  checkUserExists: jest.fn().mockResolvedValue({ uid: "1234" }),
}));

describe("MessageThread", () => {
  const onClose = jest.fn();
  const rideRequest = { outgoingUserId: "1234" };
  it("outer view is displayed", () => {
    const { getByTestId } = render(
      <MessageThread onClose={onClose} rideRequest={rideRequest} />
    );
    expect(getByTestId("messageThreadView")).toBeTruthy();
  });
});
