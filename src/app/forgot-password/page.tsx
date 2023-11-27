"use client";
import Input from "@/shared/Input/Input";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Route } from "next";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const ForgotPasswordPage = () => {
  const homeRouter = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        const response = await axios.put(`${apiBaseUrl}/user/update-password`, {
          email,
          newPassword: password,
        });
        console.log(response.data);
        homeRouter.push("/login" as Route);
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className={`nc-ForgotPasswordPage`} data-nc-id="ForgotPasswordPage">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Forgot Password
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="example@example.com"
                className="mt-1"
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                New Password
                <Link
                  href={"/login" as Route}
                  className="text-sm text-green-600"
                >
                  Login
                </Link>
              </span>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                className="mt-1"
              />
            </label>
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ForgotPasswordPage), {
  ssr: false,
});
