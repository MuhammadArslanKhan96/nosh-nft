"use client";
import Label from "@/components/Label/Label";
import { useAuth } from "@/hooks/useAuth";
import { useUserContext } from "@/hooks/useUserContext";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Textarea from "@/shared/Textarea/Textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import { Route } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const collectionSchema = z.object({
  name: z.string().min(3, "Minimum 3 characters required"),
  description: z.string().min(6, "Minimum 6 characters required"),
});

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
const CreateCollectionPage = ({}) => {
  useAuth();
  const homeRouter = useRouter();
  const { user } = useUserContext();
  const token = Cookies.get("loginToken");

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(collectionSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    await axios
      .post(
        `${apiBaseUrl}/collection/create/${user.id}`,
        {
          name: data.name,
          description: data.description,
          primaryOwner: user.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Collection created");
        homeRouter.push("/upload-item" as Route);
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occured while creating collection");
      });
  };

  return (
    <div className={`nc-CreateCollectionPage`}>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              New Collection
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              Create a new NFT collection.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
          <div className="flex flex-col md:flex-row">
            <div className="flex-grow mt-10 md:mt-0 max-w-4xl space-y-5 sm:space-y-6 md:sm:space-y-7">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-column space-y-10"
              >
                <div>
                  <Label>Title</Label>
                  <Input
                    {...register("name")}
                    className="mt-1.5"
                    placeholder="Collection name"
                    type="text"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 pt-3">{`${errors.name.message}`}</p>
                  )}
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    {...register("description")}
                    rows={7}
                    className="mt-1.5"
                    placeholder="Description of your collection."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 pt-3">{`${errors.description.message}`}</p>
                  )}
                </div>

                <div className="pt-2">
                  <ButtonPrimary className="w-full" type="submit">
                    Create
                  </ButtonPrimary>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default dynamic(() => Promise.resolve(CreateCollectionPage), {
  ssr: false,
});
