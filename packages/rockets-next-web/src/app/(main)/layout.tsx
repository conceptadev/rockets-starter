"use client";

import { type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@concepta/react-auth-provider";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";

import AppBarContainer from "@/components/AppBarContainer";

export default function Main({ children }: { children: ReactNode }) {
  const { accessToken: authToken, setUser } = useAuth();
  const { get } = useDataProvider();

  const accessToken = authToken ?? localStorage.getItem("accessToken");

  useQuery(
    () =>
      get({
        uri: `/user/${jwtDecode(accessToken).sub}`,
      }),
    true,
    {
      onSuccess: (data) => {
        setUser(data);
      },
    }
  );

  return <AppBarContainer>{children}</AppBarContainer>;
}
