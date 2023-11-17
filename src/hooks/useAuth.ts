import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useAuth() {
  const router = useRouter();
  const token = Cookies.get("loginToken");
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);
}
