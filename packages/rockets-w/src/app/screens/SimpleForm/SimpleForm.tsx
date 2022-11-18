import { FC } from 'react'
import { Text, Container } from '@concepta/react-material-ui'
import ScreenWithContainer from 'app/components/ScreenWithContainer'
import Form from './Form'

const SimpleForm: FC = () => (
  <ScreenWithContainer currentId="simpleform">
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
)

export default SimpleForm
