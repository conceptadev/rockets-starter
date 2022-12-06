import { FC } from "react";
import { Text } from "@concepta/react-material-ui";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import ScreenWithContainer from "app/components/ScreenWithContainer";
import ArrayForm from "./ArrayForm";
import ArrayMultiForm from "./ArrayMultiForm";
import SimpleForm from "./SimpleForm";
import OtherFormElements from "./OtherFormElements";
import SwitchElementForm from "./SwitchElementForm";

const Jsonform: FC = () => (
  <ScreenWithContainer currentId="jsonform">
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

      <SimpleForm />

      <Divider sx={{ my: 8 }} />

      <ArrayForm />

      <Divider sx={{ my: 8 }} />

      <OtherFormElements />

      <Divider sx={{ my: 8 }} />

      <SwitchElementForm />

      <ArrayForm />

      <ArrayMultiForm />
    </Container>
  </ScreenWithContainer>
);

export default Jsonform;
