"use client";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import NcImage from "@/shared/NcImage/NcImage";
import metamaskImg from "@/images/metamask.webp";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useUserContext } from "@/hooks/useUserContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
declare let window: any;

const plans = [
  {
    name: "Metamask",
    img: metamaskImg,
  },
];
const PageConnectWallet = ({}) => {
  useAuth();
  const { user, setUser } = useUserContext();
  const router = useRouter();

  const getWalletFunction = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res: string[]) => {
          const wallet = res.length > 0 ? String(res[0]) : null;
          if (wallet) {
            Cookies.set("wallet", wallet, {
              expires: 1 / 24,
            });
            setUser({
              ...user,
              wallet: wallet,
            });
            router.push("/");
            toast.success("Wallet connected");
          }
        })
        .catch((err: Error) => {
          console.log(err);
        });
    } else {
      toast.error("Please install metamask extension");
    }
  };

  return (
    <div className={`nc-PageConnectWallet`}>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-3xl mx-auto space-y-8 sm:space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Connect your wallet.
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              Connect with one of our available wallet providers or create a new
              one.
            </span>
          </div>

          <hr className="w-full border-t-2 border-neutral-100 dark:border-neutral-700" />

          <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  onClick={getWalletFunction}
                  typeof="button"
                  tabIndex={0}
                  className="relative rounded-xl hover:shadow-lg border 
                border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
                focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
                dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                >
                  <div className="flex items-center w-full">
                    <NcImage
                      src={plan.img}
                      containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-2xl overflow-hidden"
                    />
                    <div
                      className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                    >
                      {plan.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 ">
              <ButtonPrimary href={"/"} className="flex-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.5 12H3.67004"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2">Go Back Home</span>
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageConnectWallet;
