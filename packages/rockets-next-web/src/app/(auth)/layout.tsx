"use client";

import { ReactNode } from "react";
import useCheckTokens from "@/hooks/useCheckTokens";
import { useRouter } from "next/navigation";

import Loading from "@/components/Loading";

export default function LayoutAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { hasAccessToken, isPending } = useCheckTokens();

  if (hasAccessToken && !isPending) {
    return router.replace("/users");
  }

  if (isPending) {
    return <Loading />;
  }

  return children;
}
