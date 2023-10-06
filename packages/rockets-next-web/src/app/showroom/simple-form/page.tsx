"use client";

import { FC } from "react";
import { Text } from "@concepta/react-material-ui";
import Container from "@mui/material/Container";
import Form from "./Form";

const SimpleForm: FC = () => (
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
);

export default SimpleForm;
