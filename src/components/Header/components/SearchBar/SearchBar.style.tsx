import styled from 'styled-components';
import { getSpacing, media } from 'stylesheet';
import { MOBILE_HEADER_HEIGHT } from '../../Header.style';

const DESKTOP_SEARCH_BAR_HEIGHT = '53px';

export const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  ${media.desktop(`
    position: relative;
    margin-left: ${getSpacing(5)};
    margin-right: ${getSpacing(10)};
  `)}
  .MuiInputBase-root {
    height: ${MOBILE_HEADER_HEIGHT};
    ${media.desktop(`
      height: ${DESKTOP_SEARCH_BAR_HEIGHT};
    `)}
  }
  .MuiButtonBase-root {
    padding-right: ${getSpacing(5)};
    ${media.desktop(`
      padding-right: ${getSpacing(4)};
    `)}
  }
  .MuiInputBase-input {
    padding-left: ${getSpacing(5)};
    ${media.desktop(`
      padding-left: ${getSpacing(4)};
    `)}
  }
`;
