import styled, { css } from 'styled-components';
import {
  colorPalette,
  media,
  getSpacing,
  fonts,
  fontWeight,
  defaultMargins,
  SPACING_UNIT,
} from 'stylesheet';
import { SHADOW } from '../../../FixedBottomButton/FixedBottomButton.style';

export const DESKTOP_CONTAINER_WIDTH = SPACING_UNIT * 64;

export const Container = styled.div`
  background-color: ${colorPalette.greyLight};
  padding: ${getSpacing(6)};
  margin: ${getSpacing(6)} -${getSpacing(6)} 0 -${getSpacing(6)};
  ${media.desktop(`
    min-width: ${DESKTOP_CONTAINER_WIDTH}px;
    max-width: ${DESKTOP_CONTAINER_WIDTH}px;
    margin: -64px -${getSpacing(8)} -${getSpacing(8)} ${getSpacing(6)};
    padding: 64px ${getSpacing(6)} ${getSpacing(6)} ${getSpacing(6)};
  `)}
`;

export const DesktopButtonsContainer = styled.div`
  display: none;
  ${media.desktop(`
    display: flex;
    flex-direction: column;
    > :first-child {
      margin-bottom: ${getSpacing(2)};
    }
  `)}
`;

export const MobileButtonsContainer = styled.div`
  margin-top: ${getSpacing(6)};
  ${media.desktop(`
    display: none;
  `)}
`;

export const SectionTitle = styled.div`
  ${fonts.h3};
  color: ${colorPalette.greyDark};
  :not(:nth-child(2)) {
    margin-top: ${getSpacing(6)};
  }

  ${media.desktop(`
    margin-top: ${getSpacing(6)};
  `)}
`;

export const OneInformationContainer = styled.div<{
  onClick?: () => void;
}>`
  display: flex;
  align-items: flex-start;
  margin-top: ${getSpacing(3)};
  ${({ onClick }) =>
    onClick !== undefined
      ? css`
          cursor: pointer;
        `
      : css``}
`;

const ONE_INFORMATION_ICON_SIZE = getSpacing(4);

export const OneInformationIcon = styled.img`
  height: ${ONE_INFORMATION_ICON_SIZE};
  width: ${ONE_INFORMATION_ICON_SIZE};
`;

export const OneInformationLabel = styled.div<{
  color: string;
  bold?: boolean;
  onOneLine?: boolean;
}>`
  ${fonts.input};
  color: ${({ color }) => color};
  font-weight: ${({ bold }) => (bold === true ? fontWeight.bold : fontWeight.normal)};
  margin-left: ${getSpacing(2)};
  margin-top: -1px;
  ${({ onOneLine }) =>
    onOneLine === true
      ? css`
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `
      : css``}
`;

const MOBILE_PARTICIPATE_BUTTON_Z_INDEX = 1;

export const MobileEventParticipateButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${getSpacing(3)} ${defaultMargins.horizontal.mobile};
  background-color: ${colorPalette.white};
  display: flex;
  box-shadow: ${SHADOW};
  z-index: ${MOBILE_PARTICIPATE_BUTTON_Z_INDEX};
`;

export const ShareEventButtonWrapper = styled.div`
  > button,
  button:hover {
    color: ${colorPalette.pink};
    border-color: ${colorPalette.pink};
  }
`;
