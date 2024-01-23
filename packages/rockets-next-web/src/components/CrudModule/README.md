# CrudModule

## **TableProps**

Props that modify the layout and/or functionality of the module Table.

### **tableSchema**

Array of union types containing `HeaderProps` (imported from `@concepta/react-material-ui/dist/components/Table/types`) and additional atributes representing columns that should be rendered by the table. Each arary item can contain `id`, `label`, `disablePadding`, `width`, `numeric`, `textAlign`, `sortable` and `format` attributes, being `id` and `label` the only required ones.

Important to mention that `format` represents a custom format for the column data.

```js
[
  {
    id: "fullName", // required
    label: "Full Name", // required
    disablePadding: false,
    width: 100,
    numeric: false,
    textAlign: "left" | "center" | "right",
    sortable: true,
    format: (value: string | number) => new Date(value).toString(),
  },
];
```

**type**: `HeaderProps[]`\
**default**: `ID`, `Email`, `Username` and `Actions`
**required**: `false`

### **searchParam**

ID of a column data by which table items can be filtered when changing the search input value.

**type**: `string`\
**default**: `email`\
**required**: `false`

### **hideActionColumn**

Actions table column is visible by default. This prop is responsible for changing that.

**type**: `boolean`\
**default**: `false`\
**required**: `false`

### **overrideDefaults**

Based on this prop, the table defaults can be overritten and only the values passed by prop are considered by the table.

**type**: `boolean`\
**default**: `false`\
**required**: `false`

## **DrawerFormProps**

Props passed to modify layout/functionality of the edit/create form, displayed on a drawer by default.

### **formSchema**

Schema for the title, name and data of the drawer form fields, imported from `@rjsf/utils`.

**type**: `RJSFSchema`\
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

### **overrideDefaults**

Based on this prop, the edit/create form defaults can be overritten and only the values passed by prop are considered by the form.

**type**: `boolean`\
**default**: `false`\
**required**: `false`

## Props

Set of props passed to the `CrudModule` instance.

### **title**

Name of the CRUD workflow performed by the module.

**type**: `string`\
**required**: `false`

### **resource**

Name of the API resource accessed by the module workflows. Directly implies how the workflow will happen, and because of that, the API must be structured in the following way:

[GET] `/{resource}` (list all data, returns array in a `data` response property)\
[GET] `/{resource}?simpleFilter="email"contL"john"` (filters data that contain `john` in their `email`)\
[POST] `/{resource}` (create new data based on request body)\
[PATCH] `/{resource}/id` (edit data based on request body)\
[DELETE] `/{resource}/id` (delete data based on id)\

**type**: `string`\
**required**: `true`

### **tableProps**

**type**: `TableProps`\
**required**: `false`

### **drawerFormProps**

**type**: `DrawerFormProps`\
**required**: `false`
