import styled from 'styled-components';
import { getSpacing, colorPalette, media } from 'stylesheet';
import { MediumLargeButton } from 'components/Button/Button';

export const Container = styled.div`
  padding: ${getSpacing(3)} 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${media.desktop(`
    padding: ${getSpacing(8)} ${getSpacing(12)};
    background-color: ${colorPalette.greyLight};
  `)}
`;

export const CoalitionName = styled.p`
  color: ${colorPalette.blueCoalition};
  margin-bottom: ${getSpacing(2)};
`;
CoalitionName.displayName = 'CoalitionName';

export const AuthorAndSupportsWrapper = styled.div`
  margin-top: ${getSpacing(2)};
`;

export const MobileSupportButtonWrapper = styled.div`
  z-index: 1;
  ${media.desktop(`
    display: none;
  `)}
`;

export const DesktopSupportButton = styled(MediumLargeButton)`
  display: none;
  ${media.desktop(`
    display: block;
    padding-left: ${getSpacing(14)};
    padding-right: ${getSpacing(14)};
    margin-left: ${getSpacing(6)};
  `)}
`;

export const CauseName = styled.h1`
  color: ${colorPalette.greyDark};
`;