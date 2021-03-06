import styled, { css } from 'styled-components';
import {
  getSpacing,
  media,
  fonts,
  colorPalette,
  defaultMargins,
  contentMaxWidth,
} from 'stylesheet';
import { DESKTOP_BUTTONS_WIDTH } from 'components/CauseDetails/components/HeaderButtons/HeaderButtons.style';
import { FullWidthButton } from 'components/Button/Button';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${getSpacing(3)} ${defaultMargins.horizontal.mobile} 0
    ${defaultMargins.horizontal.mobile};
  ${media.desktop(`
    align-items: center;
    padding: ${getSpacing(8)} ${defaultMargins.horizontal.desktop};
    background-color: ${colorPalette.greyLight};
  `)}
`;

export const Image = styled.img`
  width: 100%;
  object-fit: cover;
  height: ${getSpacing(27)};
  ${media.desktop(`
    height: ${getSpacing(63)};
  `)};
`;

export const Title = styled.h1`
  ${fonts.h1Small};
  color: ${colorPalette.greyDark};
  margin-bottom: ${getSpacing(2)};
`;

export const ContentContainer = styled.div`
  padding: 0 ${defaultMargins.horizontal.mobile} ${defaultMargins.vertical.mobile}
    ${defaultMargins.horizontal.mobile};
  ${media.desktop(`
    padding: 0 ${defaultMargins.horizontal.desktop} ${defaultMargins.vertical.desktop} ${defaultMargins.horizontal.desktop};
  `)};
`;

export const ContentSubContainer = styled.div<{ center?: boolean; maxWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ center }) =>
    center === true
      ? css`
          align-items: center;
        `
      : css``};
  ${({ maxWidth }) =>
    maxWidth === true
      ? css`
          ${media.desktop(`
            max-width: ${contentMaxWidth};
          `)};
        `
      : css``};
  margin-top: ${defaultMargins.vertical.mobile};
  ${media.desktop(`
    margin-top: ${defaultMargins.vertical.desktop};
  `)};
`;

export const HeaderSubContainer = styled.div`
  ${media.desktop(`
    width: ${DESKTOP_BUTTONS_WIDTH};
  `)};
`;

export const FollowButton = styled(FullWidthButton)`
  display: none;
  ${media.desktop(`
    display: flex;
    margin-bottom: ${getSpacing(3)};
  `)};
`;

export const HeaderSubSubContainer = styled.div`
  display: flex;
  align-items: center;
`;
