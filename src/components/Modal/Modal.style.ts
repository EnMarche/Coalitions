import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { Close } from '@material-ui/icons';
import styled, { css } from 'styled-components';
import { colorPalette, media, getSpacing, styledTags } from 'stylesheet';
import { FormControlLabel as MUIFormControlLabel } from '@material-ui/core';

export type ContainerWidth = 'large' | 'medium' | 'small';

const getContainerStyle = (width: ContainerWidth) => {
  let widthSpacingMultiple;
  switch (width) {
    case 'small':
      widthSpacingMultiple = 75;
      break;
    case 'medium':
      widthSpacingMultiple = 85;
      break;
    case 'large':
      widthSpacingMultiple = 192;
      break;
    default:
      widthSpacingMultiple = 75;
      break;
  }
  return css`
    ${styledTags};
    .MuiPaper-root {
      padding: ${getSpacing(3)};
      ${media.desktop(`
      padding: ${getSpacing(8)};
      max-height: min(${getSpacing(150)}, calc(100vh - 2 * ${getSpacing(8)}));
      max-width: ${getSpacing(widthSpacingMultiple)};
      min-width: ${getSpacing(widthSpacingMultiple)};
    `)}
    }
  `;
};

export const SmallContainer = styled(Dialog)`
  ${getContainerStyle('small')};
`;

export const MediumContainer = styled(Dialog)`
  ${getContainerStyle('medium')};
`;

export const LargeContainer = styled(Dialog)`
  ${getContainerStyle('large')};
`;

export const CloseButton = styled(IconButton)`
  align-self: flex-end;
  padding: ${getSpacing(3)};
  margin-right: -${getSpacing(3)};
  ${media.desktop(`
    margin-top: -${getSpacing(6)};
    margin-right: -${getSpacing(3)};
  `)}
`;

const CLOSE_ICON_FONT_SIZE = '24px';

export const CloseIcon = styled(Close)`
  font-size: ${CLOSE_ICON_FONT_SIZE};
  color: ${colorPalette.greyDark};
`;

export const Title = styled.h3`
  color: ${colorPalette.greyDark};
`;
export const Description = styled.p`
  margin: ${getSpacing(5)} 0;
`;

export const FormControlLabel = styled(MUIFormControlLabel)`
  margin: 0;
`;
