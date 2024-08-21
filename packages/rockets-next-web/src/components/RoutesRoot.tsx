import { Children, ReactElement, ReactNode } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginRoute from "./LoginRoute";
import { DrawerItemProps } from "@concepta/react-material-ui";
import DefaultRoute from "./DefaultRoute";

type RoutesRootProps = {
  items: DrawerItemProps[];
  routes: ReactElement[];
  renderAppBar?: (
    menuItems: DrawerItemProps[],
    children: ReactNode
  ) => ReactNode;
};

const RoutesRoot = ({ routes, items, renderAppBar }: RoutesRootProps) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={routes[0].props.id} replace />} />
      <Route
        path="/sign-in"
        element={<LoginRoute home={routes[0].props.id} />}
      />
      {Children.map(routes, (child) => {
        return (
          <Route
            key={child.props.id}
            path={child.props.id}
            element={
              <DefaultRoute
                renderAppBar={renderAppBar}
                resource={child.props.id}
                name={child.props.name}
                items={items}
                module={child.props.module}
                page={child.props.page}
              />
            }
          />
        );
      })}
    </Routes>
  );
};

export default RoutesRoot;
