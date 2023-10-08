"use client";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input/Input";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Route } from "next";
import { toast } from "sonner";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import { useUserContext } from "@/hooks/useUserContext";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

const PageLogin = () => {
  const homeRouter = useRouter();
  const { user, setUser } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    await axios
      .post(`${apiBaseUrl}/user/login`, { email, password })
      .then((response) => {
        Cookies.set("loginToken", response.data.result.token, {
          expires: 1 / 24,
        });
        Cookies.set("userId", response.data.result.userId, {
          expires: 1 / 24,
        });
        console.log(response.data);
        setUser({
          id: response.data.result.userId,
          name: response.data.result.name,
          email: response.data.result.email,
        });
        toast.success(response.data.message);
        homeRouter.push("/");
      })
      .catch((error) => {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            <a
              onClick={() => toast("Continue with google")}
              key={"Google"}
              href={"#"}
              className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
            >
              <Image
                className="flex-shrink-0"
                src={googleSvg}
                alt={"Google Icon"}
                sizes="40"
              />
              <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                Continue With Google
              </h3>
            </a>
          </div>
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          <form
            className="grid grid-cols-1 gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                <Link
                  href={"/forgot-password" as Route}
                  className="text-sm text-green-600"
                >
                  Forgot password?
                </Link>
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
            <ButtonPrimary type="submit" disabled={isSubmitting}>
              Continue
            </ButtonPrimary>
          </form>
          {}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link className="text-green-600" href={"/signup" as Route}>
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
export default dynamic(() => Promise.resolve(PageLogin), { ssr: false });
