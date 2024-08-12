import { FC, useState } from "react";
import { SchemaForm } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { type PasswordChangeFormData } from "./types";
import {
  passwordChangeFormSchema,
  widgets,
  advancedProperties,
  validationRules,
} from "./formConfig";
import { validateForm } from "@/utils/formValidation/formValidation";

interface ChangePasswordFormProps {
  closePasswordChangeModal: () => void;
  openConfirmationModal: () => void;
}

const ChangePasswordForm: FC<ChangePasswordFormProps> = ({
  closePasswordChangeModal,
  openConfirmationModal,
}) => {
  const [formData, setFormData] = useState<PasswordChangeFormData>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleFormSubmit = async () => {
    closePasswordChangeModal();
    openConfirmationModal();
  };

  return (
    <SchemaForm.Form
      schema={passwordChangeFormSchema}
      advancedProperties={advancedProperties}
      onSubmit={handleFormSubmit}
      widgets={widgets}
      noHtml5Validate={true}
      showErrorList={false}
      formData={formData}
      onChange={({ formData }) => {
        setFormData(formData);
      }}
      customValidate={(formData, errors) =>
        validateForm(formData, errors, validationRules)
      }
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mt={4}
      >
        <Button type="submit" variant="contained" sx={{ flex: 1, mr: 1 }}>
          Save
        </Button>
      </Box>
    </SchemaForm.Form>
  );
};

export default ChangePasswordForm;
