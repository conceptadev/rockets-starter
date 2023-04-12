import { FC } from 'react';
import Container from '@mui/material/Container';
import { Text } from '@concepta/react-material-ui';
import ScreenWithContainer from 'app/components/ScreenWithContainer';
import Form from './Form';

const LiveForm: FC = () => {
  return (
    <ScreenWithContainer currentId="liveform">
      <Container maxWidth="xs">
        <Text
          variant="h4"
          fontFamily="Inter"
          fontSize={30}
          fontWeight={800}
          mt={1}
          gutterBottom
        >
          Forms
        </Text>

        <Form />
      </Container>
    </ScreenWithContainer>
  );
};

export default LiveForm;
