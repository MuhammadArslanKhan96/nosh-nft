"use client";
import Label from "@/components/Label/Label";
import { useUserContext } from "@/hooks/useUserContext";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Textarea from "@/shared/Textarea/Textarea";
import axios from "axios";
import { Route } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
const CreateCollectionPage = ({}) => {
  const homeRouter = useRouter();
  const { user } = useUserContext();
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .post(`${apiBaseUrl}/collection/create/${user.id}`, {
        name: title,
        description: description,
        primaryOwner: user.id,
      })
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
          {}
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
              <form onSubmit={handleSubmit} className="flex-column space-y-10">
                <div>
                  <Label>Title</Label>
                  <Input
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1.5"
                    placeholder="Collection name"
                    type="text"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    onChange={(e) => setDescription(e.target.value)}
                    rows={7}
                    className="mt-1.5"
                    placeholder="Description of your collection."
                  />
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
