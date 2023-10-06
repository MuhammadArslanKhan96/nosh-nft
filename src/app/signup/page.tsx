"use client";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { config } from "dotenv";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
config({ path: ".env.local" });

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const signupSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

const PageSignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const homeRouter = useRouter();

  const onSubmit = async (data: FieldValues) => {
    await axios
      .post(`${apiBaseUrl}/user/signup`, {
        name: data.username,
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        console.log(response.data);
        homeRouter.push("/login" as Route);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.detail);
      });
  };

  return (
    <div className={`nc-PageSignUp `} data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          <div className="grid gap-3">
            <a
              key="Google"
              href="#"
              className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
            >
              <Image
                sizes="40px"
                className="flex-shrink-0"
                src={googleSvg}
                alt={"Google Icon"}
              />
              <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                Continue With Google
              </h3>
            </a>
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-6"
          >
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Username
              </span>
              <Input
                {...register("username")}
                type="text"
                placeholder="abc123"
                className="mt-1"
              />
            </label>
            {errors.username && (
              <p className="text-sm text-red-500">{`${errors.username.message}`}</p>
            )}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                {...register("email")}
                type="email"
                placeholder="example@example.com"
                className="mt-1"
              />
            </label>
            {errors.email && (
              <p className="text-sm text-red-500">{`${errors.email.message}`}</p>
            )}
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input
                {...register("password")}
                type="password"
                className="mt-1"
              />
            </label>
            {errors.password && (
              <p className="text-sm text-red-500">{`${errors.password.message}`}</p>
            )}
            <ButtonPrimary disabled={isSubmitting} type="submit">
              Continue
            </ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link className="text-green-600" href={"/login" as Route}>
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(PageSignUp), { ssr: false });
