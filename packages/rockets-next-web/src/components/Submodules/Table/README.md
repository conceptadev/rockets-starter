# TableSubmodule

## Props

### **queryResource**

Prop received by the parent to determine which API resource to use on requests.

**type**: `string`\
**required**: `true`

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

### **onAction**

Callback called when an action column button is clicked. Handles an object with the `row` and `action` properties, being `row` an object with the row data and `action` a string representing what will be done with that data: `creation`, `edit` or `details`.

**type**: `function`\
**required**: `false`

### **onAddNew**

Callback called when the Add New button is clicked. Doesn't handle any data.

**type**: `function`\
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

### **refresh**

Method used for refreshing table data.

Can be passed via the `useTable` hook or independently.

**type**: `function`\
**required**: `true`

### **data**

Array of objects that represent the data displayed in the table.

Can be passed via the `useTable` hook or independently.

**type**: `unknown[]`\
**required**: `true`

### **isPending**

Indicates if table data is loading.

Can be passed via the `useTable` hook or independently.

**type**: `boolean`\
**required**: `true`

### **total**

Represents the total quantity of data items displayed in the table pages.

**type**: `number`\
**required**: `true`

### **pageCount**

Represents the total of pages that the table data will be divided into.

**type**: `number`\
**required**: `true`

### **simpleFilter**

Object that represents how to filter data from the table, following the [nextjsx query](https://github.com/nestjsx/crud/wiki/Requests#filter) format.

Can be passed via the `useTable` hook or independently.

**type**: `Record<string, BasicType | BasicType[] | null>`\
**required**: `true`

### **updateSimpleFilter**

Method to update the table filter params. Handles `simpleFilter` and `resetPage` arguments, being `simpleFilter` the object structuring the filter and `resetPage` a non-required boolean that indicates if the table data should be refreshed after updating the filter.

Can be passed via the `useTable` hook or independently.

**type**: `function`\
**required**: `true`

### **tableQueryState**

Extends the `TableQueryStateProps`, imported from `@concepta/react-material-ui/dist/components/Table/types`.

Can be passed via the `useTable` hook or independently.

**type**: `TableQueryStateProps`\
**required**: `true`

### **setTableQueryState**

Method that updates the tableQueryState prop and sets the table state internally.

Can be passed via the `useTable` hook or independently.

**type**: `React.Dispatch<React.SetStateAction<TableQueryStateProps>>`\
**required**: `true`
