import React, { FunctionComponent } from 'react';
import { Container, SubContainer, SubSubContainer, Title, EmptyDiv } from './SuccessStories.style';
import SuccessStoryCard from './components/SuccessStoryCard';
import { SUCCESS_STORIES } from './data';
import { FormattedMessage } from 'react-intl';

const SuccessStories: FunctionComponent<{}> = () => (
  <Container>
    <Title>
      <FormattedMessage id="success_stories.title" />
    </Title>
    <SubContainer>
      <SubSubContainer>
        {SUCCESS_STORIES.map((successStory, index) => (
          <SuccessStoryCard
            key={successStory.author}
            isFirst={index === 0}
            show={index <= 1}
            successStory={successStory}
          />
        ))}
        <EmptyDiv />
      </SubSubContainer>
    </SubContainer>
  </Container>
);

export default SuccessStories;
