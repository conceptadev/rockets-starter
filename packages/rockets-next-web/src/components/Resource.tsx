import { ReactNode } from "react";
import { Route } from "react-router-dom";
import { ModuleProps } from "@concepta/react-material-ui/dist/modules/crud";

type ResourceProps = {
  id: string;
  name: string;
  icon: ReactNode;
  module?: Partial<ModuleProps>;
  page?: ReactNode;
};

const Resource = ({ id }: ResourceProps) => {
  return <Route path={id} />;
};

export default Resource;
