import styled, { css } from 'styled-components';

import {
  getSpacing,
  colorPalette,
  fontFamily,
  lineHeight,
  fontSize,
  defaultMargins,
  media,
  fontWeight,
} from 'stylesheet';

export const CoalitionFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${defaultMargins.horizontal.mobile}
    calc(${defaultMargins.vertical.mobile} - ${getSpacing(2)}) ${defaultMargins.horizontal.mobile};
  ${media.desktop(`
    padding: 0 ${defaultMargins.horizontal.desktop} calc(${
    defaultMargins.vertical.desktop
  } - ${getSpacing(2)}) ${defaultMargins.horizontal.desktop};
  `)};
`;

export const CoalitionFiltersSubContainer = styled.div<{ displayAll: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: space-between;
  overflow: hidden;
  transition: max-height 0.5s;
  ${({ displayAll }) =>
    displayAll
      ? css`
          max-height: 800px;
        `
      : css`
          max-height: ${getSpacing(7)};
          ${media.desktop(`
            max-height: ${getSpacing(9)};
          `)};
        `};
`;

export const StyledChip = styled.div<{ isSelected?: boolean }>`
  min-width: ${getSpacing(10)};
  text-align: center;
  width: fit-content;
  border-radius: 20px;
  padding: ${getSpacing(1)} ${getSpacing(2)};
  margin-right: ${getSpacing(1)};
  margin-bottom: ${getSpacing(2)};
  cursor: pointer;
  font-family: ${fontFamily.primary};
  line-height: ${lineHeight.primary};
  font-size: ${fontSize.smallButton.mobile};
  font-weight: ${fontWeight.normal};
  ${({ isSelected }) =>
    isSelected === false || isSelected === undefined
      ? css`
          color: ${colorPalette.mintGreen2};
          background-color: ${colorPalette.white};
          border: 1px solid ${colorPalette.mintGreen2};
        `
      : css`
          color: ${colorPalette.blueCoalition};
          background-color: ${colorPalette.mintGreen};
          border: 1px solid ${colorPalette.white};
        `};
  ${media.desktop(`
    font-size: ${fontSize.p.mobile};
    padding: ${getSpacing(2)} ${getSpacing(3)};
    margin-right: ${getSpacing(2)};
  `)};
`;
StyledChip.displayName = 'StyledChip';

export const Chevron = styled.img<{ displayAll: boolean }>`
  margin-top: ${getSpacing(2)};
  height: ${getSpacing(5)};
  width: ${getSpacing(5)};
  transition: transform 0.5s;
  ${({ displayAll }) =>
    displayAll
      ? css`
          transform: rotate(180deg);
        `
      : ''};
`;
