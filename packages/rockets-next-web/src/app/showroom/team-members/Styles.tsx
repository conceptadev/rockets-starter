import { FC } from "react";
import { SimpleForm } from "@concepta/react-material-ui";
import Button from "@mui/material/Button";
import { FormType } from "@concepta/react-material-ui/dist/components/SimpleForm";

const Footer: FC = () => <Button>Save changes</Button>;

type MemberFormProps = {
  closeMemberModal: () => void;
};

const MemberForm: FC<MemberFormProps> = ({ closeMemberModal }) => {
  const onError = (error: unknown) => {
    console.error(error);
  };

  const form: FormType = {
    submitButtonLabel: "Send",
    fields: {
      email: {
        type: "string",
        title: "Email",
        required: true,
      },
      role: {
        title: "Role",
        type: "select",
        options: ["Owner", "Admin", "Member"],
      },
    },
  };

  return (
    <SimpleForm
      form={form}
      onSubmit={() => {
        closeMemberModal();
      }}
      onError={onError}
    />
  );
};

export { Footer, MemberForm };
