"use client";
import { FC, useContext, useEffect } from "react";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import SwitchDarkMode from "@/shared/SwitchDarkMode/SwitchDarkMode";
import AvatarDropdown from "./AvatarDropdown";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Navigation from "@/shared/Navigation/Navigation";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { Route } from "next";
import { usePathname } from "next/navigation";
import Avatar from "@/shared/Avatar/Avatar";
import ImageAvatar from "../../images/avatars/ImageAvatar.png";
import { UserContext } from "@/context/userContext";

export interface MainNav2LoggedProps {}

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  const userContext = useContext(UserContext);
  if (!userContext) return <></>;
  const router = usePathname();

  useEffect(() => {
    console.log(userContext.user);
  }, [router, userContext, userContext.user, userContext.user.userId]);

  // useLayoutEffect(() => {
  //   if (user !== false) {
  //     console.log(user);
  //   }
  //   if (user == false) {
  //     console.log(user);
  //   }
  // }, [user]);
  return (
    <div className={`nc-MainNav2Logged relative z-10`}>
      <div className="container">
        <div className="h-20 flex justify-between space-x-4 xl:space-x-8">
          <div className="self-center flex justify-start flex-grow space-x-3 sm:space-x-8 lg:space-x-10">
            <Logo />
            <div className="hidden sm:block flex-grow max-w-xs">
              <form action="" method="POST" className="relative">
                <Input
                  type="search"
                  placeholder="Search items"
                  className="pr-10 w-full"
                  sizeClass="h-[42px] pl-4 py-3"
                />
                <span className="absolute top-1/2 -translate-y-1/2 right-3 text-neutral-500">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 22L20 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input type="submit" hidden value="" />
              </form>
            </div>
          </div>
          <div className="flex-shrink-0 flex justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
            <div className="hidden xl:flex space-x-2">
              <Navigation />
              <div className="self-center hidden sm:block h-6 border-l border-neutral-300 dark:border-neutral-6000"></div>
              <div className="flex">
                <SwitchDarkMode />
                {/* <NotifyDropdown /> */}
              </div>
              <div></div>
              <ButtonPrimary
                href="/upload-item"
                className="self-center"
                sizeClass="px-4 py-2 sm:px-5"
              >
                Create
              </ButtonPrimary>
              {userContext.user.userId ? (
                <></>
              ) : (
                <>
                  <ButtonSecondary
                    className="self-center"
                    href={"/login" as Route}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Sign In
                  </ButtonSecondary>
                </>
              )}

              <div></div>
              {userContext.user.userId ? (
                <>
                  <AvatarDropdown />
                </>
              ) : (
                <div className="self-center">
                  <Avatar
                    imgUrl={ImageAvatar}
                    sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 xl:hidden">
              {/* <NotifyDropdown /> */}
              <ButtonPrimary
                href={"/upload-item"}
                className="self-center"
                sizeClass="px-4 py-2 sm:px-5"
              >
                Create
              </ButtonPrimary>
              {userContext.user.userId ? (
                <>
                  <AvatarDropdown />
                </>
              ) : (
                <div className="self-center">
                  <Avatar
                    imgUrl={ImageAvatar}
                    sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                  />
                </div>
              )}
              <MenuBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2Logged;