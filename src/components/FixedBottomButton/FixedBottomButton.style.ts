import styled from 'styled-components';
import { getSpacing, colorPalette, media } from 'stylesheet';

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${getSpacing(3)};
  background-color: ${colorPalette.white};
  ${media.desktop(`
    position: unset;
    bottom: unset;
    left: unset;
    right: unset;
    padding: unset;
    background-color: unset;
  `)}
`;