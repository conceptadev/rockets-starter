"use client";

import { type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@concepta/react-auth-provider";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";

import AppBarContainer from "@/components/AppBarContainer";
import Loading from "@/components/Loading";

export default function Main({ children }: { children: ReactNode }) {
  const { accessToken: authToken, setUser } = useAuth();
  const { get } = useDataProvider();

  const accessToken = authToken ?? localStorage.getItem("accessToken");

  const { data, isPending } = useQuery(
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

  if (!data && isPending) {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

  return <AppBarContainer>{children}</AppBarContainer>;
}
