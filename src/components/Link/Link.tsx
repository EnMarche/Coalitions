import styled, { css } from 'styled-components';
import {
  borderRadius,
  colorUsage,
  fontFamily,
  fontWeight,
  getSpacing,
  lineHeight,
} from 'stylesheet';

import { Link as InitialLink } from 'react-router-dom';

interface ILink {
  href?: string;
  to?: string;
  disabled?: boolean;
}

const Link = styled.a<ILink>`
  padding: ${getSpacing(2)} ${getSpacing(4)};

  font-weight: ${fontWeight.bold};
  font-family: ${fontFamily.main};
  font-size: inherit;
  line-height: ${lineHeight.medium};
  text-decoration: none;

  color: ${props => (props.disabled ? colorUsage.linkColorDisabled : colorUsage.linkColor)};
  transition: color 0.3s ease-in-out;

  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  ${props =>
    props.disabled &&
    css`
      pointer-events: none;
    `}

  border: none;
  border-radius: ${borderRadius.medium};

  :hover {
    color: ${props => (props.disabled ? colorUsage.linkColorDisabled : colorUsage.linkColorHover)};
  }
`;

export const DefaultLink = styled(InitialLink)`
  text-decoration: none;
`;

export default Link;
