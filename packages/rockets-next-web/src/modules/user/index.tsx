import { type ModuleProps } from "@concepta/react-material-ui/dist/modules/crud";

import { RJSFSchema, UiSchema } from "@rjsf/utils";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import { toast } from "react-toastify";

const tableSchema: ModuleProps["tableProps"]["tableSchema"] = [
  { id: "id", label: "ID" },
  { id: "username", label: "Username" },
  { id: "email", label: "Email" },
];

const filters: ModuleProps["tableProps"]["filters"] = [
  {
    id: "id",
    label: "ID",
    operator: "eq",
    type: "text",
    columns: 3,
  },
  {
    id: "username",
    label: "Username",
    operator: "contL",
    type: "text",
    columns: 3,
  },
  {
    id: "email",
    label: "Email",
    operator: "contL",
    type: "text",
    columns: 3,
  },
];

const schema: RJSFSchema = {
  type: "object",
  required: ["email", "username"],
  properties: {
    email: { type: "string", title: "Email", minLength: 3, format: "email" },
    username: { type: "string", title: "Username", minLength: 3 },
  },
};

const uiSchema: UiSchema = {
  email: {
    "ui:widget": CustomTextFieldWidget,
  },
  username: {
    "ui:widget": CustomTextFieldWidget,
  },
};

const userModule: Omit<ModuleProps, "resource"> = {
  tableProps: {
    tableSchema,
    filters,
    hasAllOption: true,
    hideActionsColumn: false,
    reordable: true,
    onDeleteSuccess: () => toast.success("User successfully deleted!"),
    onDeleteError: () => toast.error("Error deleting user!"),
    allowModalPreview: false,
  },
  createFormProps: {
    formSchema: schema,
    formUiSchema: uiSchema,
    submitButtonTitle: "Create",
    cancelButtonTitle: "Cancel",
    hideCancelButton: false,
    customFooterContent: null,
    customValidate: undefined,
    onSuccess: (data) =>
      toast.success(
        `${(data as Record<string, string>).username} successfully created!`
      ),
    onError: () => toast.error("Error creating user!"),
  },
  editFormProps: {
    formSchema: {
      ...schema,
      properties: {
        ...schema.properties,
        username: {
          type: "string",
          title: "Username",
          minLength: 3,
          readOnly: true,
        },
      },
    },
    formUiSchema: uiSchema,
    submitButtonTitle: "Save",
    cancelButtonTitle: "Delete",
    hideCancelButton: false,
    customFooterContent: null,
    customValidate: undefined,
    onSuccess: (data) =>
      toast.success(
        `${(data as Record<string, string>).username} successfully edited!`
      ),
    onError: () => toast.error("Error editing user!"),
    onDeleteSuccess: () => toast.success("User successfully deleted!"),
    onDeleteError: () => toast.error("Error deleting user!"),
  },
  detailsFormProps: {
    formSchema: schema,
    formUiSchema: uiSchema,
    cancelButtonTitle: "Close",
    hideCancelButton: false,
  },
  formContainerVariation: "modal",
  hideEditButton: false,
  hideDeleteButton: false,
  hideDetailsButton: false,
  onFetchError: () => toast.error("Error fetching data!"),
  filterCallback: () => null,
  externalSearch: {},
  navigate: () => null,
  filterCacheKey: "filterSettings",
  tableCacheKey: "tableSettings",
  cacheApiPath: "",
  enableTableRowSelection: false,
  addButtonStartIcon: null,
  addButtonEndIcon: null,
  addButtonContent: null,
  additionalFilterRowContent: null,
};

export default userModule;
