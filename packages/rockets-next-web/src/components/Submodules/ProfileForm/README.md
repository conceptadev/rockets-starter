# ProfileFormSubmodule

## Props

### **queryUri**

Uri for the query of any auth workflow outside of `Sign In`. Passing a value here will mount the request as `{baseURL}{queryUri}` on submitting the form.

**type**: `string`\
**default**: `/user` or `/auth/recovery/password`\
**required**: `false`

### **queryMethod**

REST method of the request performed on form submit. Can be `post`, `patch` or `put`.

**type**: `string`\
**default**: `post`\
**required**: `false`

### **title**

Title displayed above the form fields to indicate which form is being displayed.

**type**: `string`\
**default**: `Sign In`, `Sign up`, `Recover password` or `Reset Password`\
**required**: `false`

### **formSchema**

Schema for the title, name and data of form fields, imported from `@rjsf/utils`.

**type**: `RJSFSchema`\
**required**: `false`

### **formUiSchema**

Schema for the layout of form fields, imported from `@rjsf/utils`.

**type**: `UiSchema`\
**required**: `false`

### **advancedProperties**

Complementary properties of the form fields. `AdvancedProperty` type can be imported from `@concepta/react-material-ui/dist/components/SchemaForm/types`.

**type**: `Record<string, AdvancedProperty>`\
**required**: `false`

### **formData**

Passing an object to this prop automatically fills the fields related to the object's attributes.

**type**: `Record<string, unknown> | null`\
**required**: `false`

### **customValidation**

Array of rules to validate one or more fields in a more specific logic. Each array item must contain `field`, `test` and `message` attributes, as follows:

```js
[
  {
    field: "passwordConfirmation",
    test: (value, formData) => value !== formData.password,
    message: "Passwords don't match!",
  },
];
```

**type**: `ValidationRule<Record<string, string>>[]`\
**required**: `false`

### **submitButtonTitle**

Text displayed in the form submit button.

**type**: `string`\
**default**: `Send`\
**required**: `false`

### **successFeedbackMessage**

Message displayed when the query runs successfully.

**type**: `string`\
**default**: `Profile successfully updated`\
**required**: `false`

### **errorFeedbackMessage**

Message displayed when the query returns an error.

**type**: `string`\
**required**: `false`

### **overrideDefaults**

Based on this prop, the form defaults can be overritten and only the values passed by prop are considered by the form.

**type**: `boolean`\
**default**: `false`\
**required**: `false`
