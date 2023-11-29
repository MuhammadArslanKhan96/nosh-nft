"use client";
import NcImage from "@/shared/NcImage/NcImage";
import Avatar from "@/shared/Avatar/Avatar";
import collectionPng from "@/images/nfts/collection.png";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import AccordionInfo from "@/components/AccordionInfo";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import Badge from "@/shared/Badge/Badge";
import { toast } from "sonner";
import ABI from "@/../contracts/ABI-NFTMarketplace.json";
import { ethers } from "ethers";
import ItemTypeImageIcon from "@/components/ItemTypeImageIcon";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
declare let window: any;

const NftDetailPage = ({}) => {
  const userId = Cookies.get("userId");
  const token = Cookies.get("loginToken");
  const wallet = Cookies.get("wallet");
  const params = useSearchParams();
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["nft"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiBaseUrl}/nfts/get-nft/${params.get("id")}`
      );
      console.log(data.result[0]);
      return data.result;
    },
  });
  const handleSubmit = async () => {
    if (!wallet) {
      toast.error("Please connect wallet to buy NFT");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      data[0].collection_address,
      ABI,
      signer
    );
    const priceInt = ethers.parseEther(data[0].price ? data[0].price : "0.0");

    try {
      const transaction = await contract.buyNFT(data[0].token_id, {
        value: priceInt,
      });
      await transaction.wait();
      console.log(`NFT with tokenId ${data[0].token_id} has been bought`);
    } catch (error) {
      toast.error("Error occured while buying NFT");
      console.error("An error occurred", error);
      return;
    }
    if (userId) {
      await axios
        .put(
          `${apiBaseUrl}/nfts/update/${userId}`,
          {
            id: params.get("id"),
            status: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          router.push("/nft");
          toast.success("NFT bought successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error occured while buying NFT");
        });
    }
    if (!userId) {
      toast.error("Please login to buy NFT");
    }
  };
  const renderSection1 = () => {
    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        <div className="pb-9 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
            <div className="flex items-center">
              <Avatar
                imgUrl={data && data[0] ? data[0].user_image : ""}
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Creator</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>
                    {data && data[0] ? data[0].creator_name : "Loading..."}
                  </span>
                </span>
              </span>
            </div>
            <div className="hidden sm:block h-6 border-l border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex items-center">
              <Avatar
                imgUrl={collectionPng}
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Collection</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span> {data && data[0] ? data[0].name : "Loading..."}</span>
                  {/* <VerifyIcon iconClass="w-4 h-4" /> */}
                </span>
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl shadow-none border border-none sm:text-3xl lg:text-4xl font-semibold">
          {data && data[0] ? data[0].nft_name : "Loading..."}
        </h2>

        <div className="pb-9 pt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 flex flex-col sm:flex-row items-baseline p-6 border-2 border-green-500 rounded-xl relative">
              <span className="absolute bottom-full translate-y-1 py-1 px-1.5 bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-neutral-400">
                Price
              </span>
              <span className="text-3xl xl:text-4xl font-semibold text-green-500">
                {data && data[0] ? data[0].price : "Loading..."}
              </span>
              <span className="text-2xl xl:text-1xl ps-5 font-semibold text-green-500">
                ETH
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {data && data[0] ? (
              userId == data[0].current_owner ? (
                " "
              ) : (
                <>
                  {params.get("onSale") == "true" ? (
                    <>
                      <ButtonPrimary onClick={handleSubmit} className="flex-1">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7 12H14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <span className="ml-2.5">Buy</span>
                      </ButtonPrimary>
                    </>
                  ) : (
                    <>
                      <Badge
                        name="Not On Sale"
                        className="bg-opacity-0 border border-green-500 text-green-500"
                      />
                    </>
                  )}
                </>
              )
            ) : (
              "Loading..."
            )}
          </div>
          <div className="pt-20"></div>
          <AccordionInfo
            description={data && data[0] ? data[0].nft_description : ""}
            imageSize={data && data[0] ? data[0].size : ""}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-NftDetailPage`}>
      <main className="container mt-11 mb-20 flex">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          <div className="space-y-8 lg:space-y-10">
            <div className="relative">
              <NcImage
                src={data && data[0] ? data[0].image_url : ""}
                containerClassName="aspect-w-11 aspect-h-12 rounded-3xl overflow-hidden z-0 relative"
                fill
              />
              <ItemTypeImageIcon className="absolute left-3 top-3 w-8 h-8 md:w-10 md:h-10" />
            </div>
          </div>

          <div className="pt-10 lg:pt-0 xl:pl-10 border-t-2 border-neutral-200 dark:border-neutral-700 lg:border-t-0">
            {renderSection1()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NftDetailPage;
