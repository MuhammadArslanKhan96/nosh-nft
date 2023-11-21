import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

export async function useWallet() {
  const router = useRouter();
  const wallet = Cookies.get("wallet");
  useEffect(() => {
    if (!wallet) {
      router.push("/connect-wallet");
      toast.error("Please connect your wallet first");
    }
  }, [wallet]);
}
