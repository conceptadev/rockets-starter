import { useEffect, useRef, useState } from "react";

const useCheckTokens = () => {
  const [isPending, setIsPending] = useState(true);
  const hasAccessToken = useRef(false);

  // Only run in the browswer
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      hasAccessToken.current = true;
    }

    setIsPending(false);
  }, []);

  return { hasAccessToken: hasAccessToken.current, isPending };
};

export default useCheckTokens;
