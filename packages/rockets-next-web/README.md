This is a [React](https://react.dev/) app that uses [vite](https://vitejs.dev/) as tooling dependency.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Routing

The routes of this app are managed by the `@concepta/react-navigation` package, composed by the following parts:

**Router**

The main container for the routing system. It receives props related to general configurations and customizations related to the AppBar.

**Resource**

Item that describes a route on the app. By default, it renders a protected route and can receive props related to a CrudModule instance or custom page.

### Example

```tsx
import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RocketsProvider, createConfig } from "@concepta/react-material-ui";
import { Router, Resource } from "@concepta/react-navigation";
import { RJSFSchema } from "@rjsf/utils";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

function AdminProvider({
  children,
  home,
}: PropsWithChildren<{ home: string }>) {
  const navigate = useNavigate();

  const handleError = () => toast.error("Unable to process the request.");

  const config = createConfig({
    dataProvider: {
      apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
    },
    auth: {
      onAuthSuccess: () => navigate(home),
      onAuthError: handleError,
      onLogout: () => navigate("/sign-in"),
    },
  });

  return <RocketsProvider {...config}>{children}</RocketsProvider>;
}

const schema: RJSFSchema = {
  type: "object",
  required: ["email", "username"],
  properties: {
    email: { type: "string", title: "Email", minLength: 3, format: "email" },
    username: { type: "string", title: "Username", minLength: 3 },
  },
};

const App = () => {
  return (
    <Router AdminProvider={AdminProvider}>
      <Resource
        id="/user"
        name="Users"
        icon={<PersonOutlinedIcon />}
        module={{
          tableProps: {
            tableSchema: [
              { id: "id", label: "ID" },
              { id: "username", label: "Username" },
              { id: "email", label: "Email" },
            ],
            filters: [
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
            ],
          },
          createFormProps: {
            formSchema: schema,
          },
          editFormProps: {
            formSchema: schema,
          },
          detailsFormProps: {
            formSchema: schema,
          },
        }}
      />
    </Router>
  );
};

export default App;
```

Considering the app is running locally, his will render a `localhost:5173/user` page, composed by breadcrumbs, title, filters and table. Also, the `/user` string will be used as the API resource, where, for example, the list of users will be fetched from a GET request for the `VITE_PUBLIC_API_URL/user` route.

## Provider

The Provider is an important part of the app structure, as it defines global settings that will be used by the application as a whole. It is imported from the `@concepta/react-material-ui` package and is instantiated inside the Router component. The previous topic (Routing) has an example of how to use the Provider in a way that works, but additional props can be passed to the instance, listed below:

**handleRefreshTokenError**

This function can be passed inside the `auth` object prop, and can be used as a custom handler for when the default `refreshToken` request fails.

**useAuth**

A hook that can be passed inside the `auth` object and be used as a custom set of data and handlers for authentication and storage of logged in user data.

## Additional Pages

Custom pages can be inserted in the router by passing a `page` prop to the Resource. This way, the custom page will be added to the AppBar and can be accessed by the route `id` in the app URL.

### Example

```tsx
import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RocketsProvider, createConfig } from "@concepta/react-material-ui";
import { Router, Resource } from "@concepta/react-navigation";
import { RJSFSchema } from "@rjsf/utils";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import ProfileScreen from "@/pages/profile";

function AdminProvider({
  children,
  home,
}: PropsWithChildren<{ home: string }>) {
  const navigate = useNavigate();

  const handleError = () => toast.error("Unable to process the request.");

  const config = createConfig({
    dataProvider: {
      apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
    },
    auth: {
      onAuthSuccess: () => navigate(home),
      onAuthError: handleError,
      onLogout: () => navigate("/sign-in"),
    },
  });

  return <RocketsProvider {...config}>{children}</RocketsProvider>;
}

const schema: RJSFSchema = {
  type: "object",
  required: ["email", "username"],
  properties: {
    email: { type: "string", title: "Email", minLength: 3, format: "email" },
    username: { type: "string", title: "Username", minLength: 3 },
  },
};

const App = () => {
  return (
    <Router AdminProvider={AdminProvider}>
      <Resource
        id="/user"
        name="Users"
        icon={<PersonOutlinedIcon />}
        module={{
          tableProps: {
            tableSchema: [
              { id: "id", label: "ID" },
              { id: "username", label: "Username" },
              { id: "email", label: "Email" },
            ],
            filters: [
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
            ],
          },
          createFormProps: {
            formSchema: schema,
          },
          editFormProps: {
            formSchema: schema,
          },
          detailsFormProps: {
            formSchema: schema,
          },
        }}
      />

      <Resource
        id="/profile"
        name="Profile"
        icon={<GroupsOutlinedIcon />}
        page={<ProfileScreen />}
      />
    </Router>
  );
};

export default App;
```
