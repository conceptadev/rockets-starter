# DrawerFormSubmodule

## Props

### **queryResource**

Prop received by the parent to determine which API resource to use on requests.

**type**: `string`\
**required**: `true`

### **formSchema**

Schema for the title, name and data of the drawer form fields, imported from `@rjsf/utils`.

**type**: `RJSFSchema`\
**required**: `false`

### **viewMode**

Defines how the form fields and submit function will behave. Can be `creation`, `edit` or `details`.

**type**: `string`\
**required**: `false`

### **formData**

Passing an object to this prop automatically fills the fields related to the object's attributes.

**type**: `Record<string, unknown> | null`\
**required**: `false`

### **formUiSchema**

Schema for the layout of drawer form fields, imported from `@rjsf/utils`.

**type**: `UiSchema`\
**required**: `false`

### **submitButtonTitle**

Text displayed in the drawer form submit button.

**type**: `string`\
**default**: `Send`\
**required**: `false`

### **cancelButtonTitle**

Text displayed in the drawer form cancel button.

**type**: `string`\
**default**: `Close`\
**required**: `false`

### **onClose**

Callback called when the drawer's Close button is clicked.

**type**: `function`\
**required**: `false`

### **onSubmitSuccess**

Callback called when the request performed after submitting form data returns successfully.

**type**: `function`\
**required**: `false`

### **overrideDefaults**

Based on this prop, the form defaults can be overritten and only the values passed by prop are considered by the form.

**type**: `boolean`\
**default**: `false`\
**required**: `false`
