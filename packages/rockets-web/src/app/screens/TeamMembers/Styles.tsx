import { FC } from "react";
import { SimpleForm } from "@concepta/react-material-ui";
import Button from "@mui/material/Button";
import { FormType } from "@concepta/react-material-ui/dist/components/SimpleForm";

const Footer: FC = () => (
  <Button onClick={() => console.log("click")}>Save changes</Button>
);

type MemberFormProps = {
  closeMemberModal: () => void;
};

const MemberForm: FC<MemberFormProps> = ({ closeMemberModal }) => {
  const onError = (error: any) => {
    console.log("error", error);
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
      onSubmit={(values) => {
        console.log("values", values);
        closeMemberModal();
      }}
      onError={onError}
    />
  );
};

export { Footer, MemberForm };
