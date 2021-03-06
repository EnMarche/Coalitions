import styled from 'styled-components';
import { borderRadius, colorUsage, getSpacing, colorPalette } from 'stylesheet';

const getBorderColor = (hasError: boolean, originalColor: string): string =>
  hasError ? colorUsage.error : originalColor;

interface Props {
  hasError: boolean;
}

const Input = styled.input<Props>`
  width: 100%;
  height: 60px;
  background-color: ${colorUsage.inputBackground};
  padding: 0 ${getSpacing(3)};
  border-radius: ${borderRadius.medium};
  border: 1px solid;
  border-color: ${props => getBorderColor(props.hasError, colorUsage.inputBorderColor)};
  color: ${colorPalette.greyDark};

  :hover {
    border-color: ${props => getBorderColor(props.hasError, colorUsage.primaryTextColor)};
  }

  :focus {
    border-color: ${props => getBorderColor(props.hasError, colorUsage.primary)};
  }

  ::placeholder {
    color: ${colorUsage.inputPlaceholderColor};
  }
`;
Input.displayName = 'Input';

export default Input;
