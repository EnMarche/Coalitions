import React, { ChangeEvent, FunctionComponent } from 'react';
import { Container, LabelsContainer, Label } from './TabBar.style';
import { colorPalette } from 'stylesheet';

interface TabBarProps {
  tabLabels: JSX.Element[];
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
  isSticky?: boolean;
  isBottomBorderFullWidth?: boolean;
}

const TAB_INDICATOR_PROPS = {
  style: {
    backgroundColor: colorPalette.mintGreen2,
  },
};

const TabBar: FunctionComponent<TabBarProps> = ({
  tabLabels,
  selectedTabIndex,
  setSelectedTabIndex,
  isSticky,
  isBottomBorderFullWidth,
}) => {
  const onTabIndexChange = (_: ChangeEvent<{}>, value: number) => {
    setSelectedTabIndex(value);
  };

  return (
    <Container isSticky={isSticky} isBottomBorderFullWidth={isBottomBorderFullWidth}>
      <LabelsContainer
        value={selectedTabIndex}
        onChange={onTabIndexChange}
        TabIndicatorProps={TAB_INDICATOR_PROPS}
      >
        {tabLabels.map(tabLabel => (
          <Label label={tabLabel} key={tabLabel.key} />
        ))}
      </LabelsContainer>
    </Container>
  );
};

export default TabBar;
