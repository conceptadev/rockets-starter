import { FC } from "react";
import { SimpleForm } from "@concepta/react-material-ui";
import { FormType } from "@concepta/react-material-ui/dist/components/SimpleForm";
import { FormValidation } from "@rjsf/utils";

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordFormProps = {
  closeMemberModal: () => void;
  openConfirmationModal: () => void;
};

const ChangePasswordForm: FC<ChangePasswordFormProps> = ({
  closeMemberModal,
  openConfirmationModal,
}) => {
  const form: FormType = {
    submitButtonLabel: "Save",
    fields: {
      oldPassword: {
        type: "password",
        title: "Old password",
        required: true,
      },
      newPassword: {
        type: "password",
        title: "New password",
        required: true,
      },
      confirmPassword: {
        type: "password",
        title: "Confirm password",
        required: true,
      },
    },
  };

  const validate = (formData: FormData, errors: FormValidation) => {
    if (formData.newPassword != formData.confirmPassword) {
      errors?.confirmPassword?.addError("Password confirmation do not match");
    }

    return errors;
  };

  return (
    <SimpleForm
      form={form}
      onSubmit={(values) => {
        // eslint-disable-next-line no-console
        console.log("values", values);
        closeMemberModal();
        openConfirmationModal();
      }}
      validate={validate}
    />
  );
};

export default ChangePasswordForm;
