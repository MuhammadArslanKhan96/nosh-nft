import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const token = Cookies.get("loginToken");
  const wallet = Cookies.get("wallet");
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
    if (!wallet) {
      router.push("/connect-wallet");
      toast.error("Please connect your wallet");
    }
  }, [token]);
}
