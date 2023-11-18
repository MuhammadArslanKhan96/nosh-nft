"use client";
import { ChangeEvent, useState } from "react";
import Label from "@/components/Label/Label";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Textarea from "@/shared/Textarea/Textarea";
import FormItem from "@/components/FormItem";
import dynamic from "next/dynamic";
import { Route } from "next";
import axios from "axios";
import Link from "next/link";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loading from "../loading";
import { useUserContext } from "@/hooks/useUserContext";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import MySwitch from "@/components/MySwitch";
import { useAuth } from "@/hooks/useAuth";
import { CollectionUploadItem } from "@/types/Collection";
import { useWallet } from "@/hooks/useWallet";
import { ethers } from "ethers";
import ABI from "@/../contracts/ABI.json";
declare let window: any;

const nftSchema = z.object({
  name: z.string().min(3, "Minimum 3 characters are allowed"),
  nftUrl: z.string().min(1),
  description: z.string().min(1),
  royalties: z.string().min(1),
  size: z.string().min(1),
  properties: z.string().min(1),
  price: z.string().min(1),
});

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
const contractAddress = "0x3ab6790DFC1d036f9694532a7B5C5e05c21F85B0";

const PageUploadItem = () => {
  useAuth();
  useWallet();
  const homeRouter = useRouter();
  const { user } = useUserContext();
  const token = Cookies.get("loginToken");
  const userId = Cookies.get("userId");
  const formData = new FormData();
  const [isOnSale, setIsOnSale] = useState(false);
  const [collections, setCollections] = useState<CollectionUploadItem[]>([]);
  const [collectionRows, setCollectionRows] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  let imageName: string;
  let imageUrl: string;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(nftSchema),
  });
  const { isLoading, isError } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiBaseUrl}/collection/get-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data.result);
      setCollectionRows(data.result.length);
      setCollections(data.result);
      return data.result;
    },
    cacheTime: Infinity,
  });

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <>An error occured. Try again</>;
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (data: FieldValues) => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);

    try {
      const tx = await contract.safeMint(await signer.getAddress());
      console.log("Transaction sent: " + tx.hash);

      // Wait for the transaction to be mined
      await tx.wait();
      console.log("Minted successfully");
    } catch (err) {
      console.error("Error minting NFT: ", err);
    }

    console.log(data);
    if (!file) {
      toast.error("NFT image is required");
      return;
    }
    if (!selectedCollectionId) {
      toast.error("Please select a collection");
      return;
    }
    formData.append("file-upload", file);
    await axios
      .post(`${apiBaseUrl}/create/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        imageUrl = response.data.imageUrl;
        imageName = response.data.imageName;
      })
      .catch((error) => {
        console.error(error);
      });
    await axios
      .post(
        `${apiBaseUrl}/nfts/create/${user.id}`,
        {
          name: data.name,
          nftUrl: data.nftUrl,
          imageName: imageName,
          imageUrl: imageUrl,
          description: data.description,
          royalties: data.royalties,
          size: data.size,
          properties: data.properties,
          price: data.price,
          onSale: isOnSale,
          primaryOwner: user.id,
          currentOwner: user.id,
          collectionId: selectedCollectionId,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("NFT created successfully");
        homeRouter.push("/nft" as Route);
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occured while creating NFT");
      });
  };

  return (
    <div className={`nc-PageUploadItem`}>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">Create Item</h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              You can set preferred display name, create your profile URL and
              manage other personal settings.
            </span>
          </div>
          <hr className="w-full border-t-2 border-neutral-100 dark:border-neutral-700" />

          <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-2xl font-semibold">Image</h3>
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB
              </span>
              <div className="mt-5 ">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          onChange={handleImageUpload}
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {selectedImage && (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                <div className="flex justify-center">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="rounded-md w-1/3 object-contain"
                  />
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-column space-y-10"
            >
              {/* ---- */}
              <FormItem label="Item Name">
                <Input {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500 pt-3">{`${errors.name.message}`}</p>
                )}
              </FormItem>

              {/* ---- */}
              <FormItem
                label="External link"
                desc="We will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
              >
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    https://
                  </span>
                  <Input
                    {...register("nftUrl")}
                    className="!rounded-l-none"
                    placeholder="abc.com"
                  />
                </div>
                {errors.nftUrl && (
                  <p className="text-sm text-red-500 pt-3">{`${errors.nftUrl.message}`}</p>
                )}
              </FormItem>

              {/* ---- */}
              <FormItem
                label="Description"
                desc={
                  <div>
                    {`The description will be included on the item's detail page
                  underneath its image.`}{" "}
                    <span className="text-green-500">Markdown</span> syntax is
                    supported.
                  </div>
                }
              >
                <Textarea
                  {...register("description")}
                  rows={6}
                  className="mt-1.5"
                  placeholder="..."
                />
                {errors.description && (
                  <p className="text-sm text-red-500 pt-3">{`${errors.description.message}`}</p>
                )}
              </FormItem>

              <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>

              <div>
                <Label>Choose collection</Label>
                <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Choose an exiting collection or create a new one
                </div>
                <div className="mt-5 ">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-neutral-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                        <label className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <Link href={"/create-collection" as Route}>
                            Create a new collection
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {collectionRows == 0 ? (
                  <></>
                ) : (
                  <>
                    <div className="mt-5 ">
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                        <div className="space-y-1 text-center">
                          <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                            <div className="flex flex-wrap overflow-auto py-2 space-x-4 customScrollBar">
                              {collections.map((collection, index) => (
                                <div
                                  key={collection.id}
                                  className={`border-2 ${
                                    selectedCollectionId === collection.id
                                      ? "border-blue-500"
                                      : "border-neutral-300 dark:border-neutral-6000"
                                  } border-dashed rounded-xl shadow-md p-6 m-2 w-64`}
                                  onClick={() => {
                                    setSelectedCollectionId(collection.id);
                                    console.log(collection.id);
                                  }}
                                >
                                  <h2 className="text-xl font-bold mb-2">
                                    {collection.name}
                                  </h2>
                                  <p className="text-gray-500">
                                    {collection.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* <RadioGroup value={selected} onChange={setSelected}>
                  <RadioGroup.Label className="sr-only">
                    Server size
                  </RadioGroup.Label>
                  <div className="flex overflow-auto py-2 space-x-4 customScrollBar">
                    {collections.map((collections, index) => (
                      <RadioGroup.Option
                        key={collections.id}
                        value={plan}
                        className={({ active, checked }) =>
                          `${
                            active
                              ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
                              : ""
                          }
                  ${
                    checked
                      ? "bg-teal-600 text-white"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }
                    relative flex-shrink-0 w-44 rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-5 cursor-pointer flex focus:outline-none `
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <div className="flex items-center justify-between">
                                    <RadioGroup.Description
                                      as="div"
                                      className={"rounded-full w-16"}
                                    >
                                      <NcImage
                                        containerClassName="aspect-w-1 aspect-h-1 rounded-full overflow-hidden"
                                        src={plan.featuredImage}
                                      />
                                    </RadioGroup.Description>
                                    {checked && (
                                      <div className="flex-shrink-0 text-white">
                                        <CheckIcon className="w-6 h-6" />
                                      </div>
                                    )}
                                  </div>
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-semibold mt-3  ${
                                      checked ? "text-white" : ""
                                    }`}
                                  >
                                    {plan.name}
                                  </RadioGroup.Label>
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-semibold mt-3  ${
                                      checked ? "text-white" : ""
                                    }`}
                                  >
                                    {plan.description}
                                  </RadioGroup.Label>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup> */}
              </div>

              {/* ---- */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-2.5">
                {/* ---- */}
                <FormItem label="Royalties">
                  <Input {...register("royalties")} placeholder="20%" />
                  {errors.royalties && (
                    <p className="text-sm text-red-500 pt-3">{`${errors.royalties.message}`}</p>
                  )}
                </FormItem>
                {/* ---- */}
                <FormItem label="Size">
                  <Input {...register("size")} placeholder="165Mb" />
                  {errors.size && (
                    <p className="text-sm text-red-500 pt-3">{`${errors.size.message}`}</p>
                  )}
                </FormItem>
                {/* ---- */}
                <FormItem label="Properties">
                  <Input {...register("properties")} placeholder="Properties" />
                  {errors.properties && (
                    <p className="text-sm text-red-500 pt-3">{`${errors.properties.message}`}</p>
                  )}
                </FormItem>
                <FormItem label="Price">
                  <Input {...register("price")} placeholder="Price" />
                  {errors.price && (
                    <p className="text-sm text-red-500 pt-3">{`${errors.price.message}`}</p>
                  )}
                </FormItem>
              </div>

              {/* ---- */}
              <MySwitch enabled={isOnSale} onChange={setIsOnSale} />

              {/* ---- */}
              {/* <MySwitch
              label="Instant sale price"
              desc="Enter the price for which the item will be instantly sold"
            /> */}

              {/* ---- */}
              {/* <MySwitch
              enabled
              label="Unlock once purchased"
              desc="Content will be unlocked after successful transaction"
            /> */}

              {/* ---- */}
              <div className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 ">
                <ButtonPrimary
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-1"
                >
                  Upload item
                </ButtonPrimary>
                {/* 
                <ButtonSecondary href="/nft-detail" className="flex-1">
                  Preview item
                </ButtonSecondary> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default dynamic(() => Promise.resolve(PageUploadItem), { ssr: false });
