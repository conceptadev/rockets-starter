import React from "react";
// import logo from "./logo.svg";
// import "./App.css";
import { SimpleForm } from "@concepta/react-material-ui/dist";
import { FormType } from "@concepta/react-material-ui/dist/components/SimpleForm";

function App() {
  const form: FormType = {
    title: "Simplest form ever",
    submitButtonLabel: "Send",
    fields: {
      email: {
        type: "string",
        title: "Email",
        required: true,
      },
      password: {
        type: "password",
        title: "Password",
        required: true,
      },
    },
  };

  return (
    <div className="App">
      <header className="App-header">
        <SimpleForm
          form={form}
          onSubmit={(values) => console.log("values", values)}
          // validate={validate}
          // onError={onError}
          // initialData={initialData}
        />
      </header>
    </div>
  );
}

export default App;
