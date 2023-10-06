"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Route } from "next";
interface PrivateRouteProps {
  children: ReactNode;
}
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("loginToken");
      if (!token && pathname !== "/login" && pathname !== "/signup") {
        router.replace("/login" as Route);
      }
    }
  }, [isClient, pathname]);
  return <>{children}</>;
};
export default PrivateRoute;
