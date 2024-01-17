"use client";

import CrudModule from "@/components/CrudModule";

interface ModuleProps {
  title?: string;
  resource?: string;
}

const UsersModule = (props: ModuleProps) => {
  return (
    <CrudModule
      title={props.title || "Users"}
      resource={props.resource || "user"}
    />
  );
};

export default UsersModule;
