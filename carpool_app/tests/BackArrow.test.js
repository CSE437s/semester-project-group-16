import BackArrow from '../components/BackArrow';
import { render, fireEvent } from '@testing-library/react-native';
import ChooseDate from '../components/ChooseDate';

describe("BackArrow", () => {
    it("calls onClose function when pressed", () => {
        const mockOnClose = jest.fn();
        const { getByTestId } = render(<BackArrow onClose={mockOnClose}/>);
        fireEvent.press(getByTestId("BackArrow"));
        expect(mockOnClose).toHaveBeenCalled();

    });
})
