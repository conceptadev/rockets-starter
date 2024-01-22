# AuthFormSubmodule

# AuthFormSubmodule

## Props

Set of props passed to the `AuthFormSubmodule` instance.

### **route**

Auth workflow that the module will perform. Can be `signIn`, `signUp`, `forgotPassword` or `resetPassword`.

**type**: `string`\
**default**: `signIn`\
**required**: `true`

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

### **signInRequestPath**

Path for the sign in request. Passing a value here will mount the request as `{baseURL}{signInRequestPath}` on submitting the sign in form.

**type**: `string`\
**default**: `/auth/login`\
**required**: `false`

### **forgotPasswordPath**

Route of the `Recover Password` page. Passing an empty string will hide the link for this page on the specific module.

**type**: `string`\
**default**: `/forgot-password`\
**required**: `false`

### **signUpPath**

Route of the `Sign Up` page. Passing an empty string will hide the link for this page on the specific module.

**type**: `string`\
**default**: `/sign-up`\
**required**: `false`

### **signInPath**

Route of the `Sign In` page. Passing an empty string will hide the link for this page on the specific module.

**type**: `string`\
**default**: `/sign-in`\
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

### **logoSrc**

Source of the logo image displayed above the form card.

**type**: `string`\
**default**: `/logo.svg`\
**required**: `false`

### **overrideDefaults**

Based on this prop, the form defaults can be overritten and only the values passed by prop are considered by the form.

**type**: `boolean`\
**default**: `false`\
**required**: `false`
