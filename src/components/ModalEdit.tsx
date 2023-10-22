"use client";
import { FC } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import NcModal from "@/shared/NcModal/NcModal";
import { FieldValues, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export interface ModalEditProps {
  show: boolean;
  id?: number;
  onCloseModalEdit: () => void;
}

const ModalEdit: FC<ModalEditProps> = ({ show, onCloseModalEdit, id }) => {
  // const textareaRef = useRef(null);
  // const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();
  const mutation = useMutation(
    (data: { id: number; price: string }) =>
      axios.put(`http://localhost:8080/nfts/update-price`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["nft"]);
        toast.success("Price updated");
      },
    }
  );

  // useEffect(() => {
  //   if (show) {
  //     setTimeout(() => {
  //       const element: HTMLTextAreaElement | null = textareaRef.current;
  //       if (element) {
  //         (element as HTMLTextAreaElement).focus();
  //         (element as HTMLTextAreaElement).setSelectionRange(
  //           (element as HTMLTextAreaElement).value.length,
  //           (element as HTMLTextAreaElement).value.length
  //         );
  //       }
  //     }, 400);
  //   }
  // }, [show]);

  // const onSubmit = async (data: FieldValues) => {
  //   console.log(data);
  //   await axios
  //     .put(`http://localhost:8080/nfts/update-price`, {
  //       id,
  //       price: data.price,
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   onCloseModalEdit();
  // };

  const onSubmit = (data: FieldValues) => {
    mutation.mutate({ id: id!, price: data.price });
    onCloseModalEdit();
  };
  const renderContent = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          Change price
        </h3>
        <span className="text-sm">Are you sure you want to change price?</span>
        <div className="mt-8 relative rounded-md shadow-sm">
          <Input {...register("price")} type={"text"} />

          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="currency" className="sr-only">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-neutral-500 dark:text-neutral-300 sm:text-sm rounded-md"
            >
              <option>ETH</option>
              {/* <option>BC</option>
              <option>BTH</option> */}
            </select>
          </div>
        </div>
        <div className="mt-4 space-x-3">
          <ButtonPrimary type="submit">Submit</ButtonPrimary>
          <ButtonSecondary type="button" onClick={onCloseModalEdit}>
            Cancel
          </ButtonSecondary>
        </div>
      </form>
    );
  };

  const renderTrigger = () => {
    return null;
  };

  return (
    <NcModal
      isOpenProp={show}
      onCloseModal={onCloseModalEdit}
      contentExtraClass="max-w-lg"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle=""
    />
  );
};

export default ModalEdit;
