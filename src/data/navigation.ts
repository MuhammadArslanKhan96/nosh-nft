import _ from "lodash";
import { NavItemType } from "@/shared/Navigation/NavigationItem";
import { Route } from "next";

const ncNanoId = _.uniqueId;

const otherPageChildMenus: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Home",
  },
  // {
  //   id: ncNanoId(),
  //   href: "/home-2" as Route,
  //   name: "Home demo 2",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/home-3" as Route,
  //   name: "Home demo 3",
  // },
  {
    id: ncNanoId(),
    href: "/search" as Route,
    name: "Search",
  },
  // {
  //   id: ncNanoId(),
  //   href: "/author" as Route,
  //   name: "Author profile",
  // },

  {
    id: ncNanoId(),
    href: "/nft-sale" as Route,
    name: "On Sale",
  },
  {
    id: ncNanoId(),
    href: "/all-collection" as Route,
    name: "Collections",
  },
  // {
  //   id: ncNanoId(),
  //   href: "/upload-item" as Route,
  //   name: "Upload Item",
  //   children: [
  //     {
  //       id: ncNanoId(),
  //       href: "/upload-item" as Route,
  //       name: "Upload Item",
  //     },
  //     {
  //       id: ncNanoId(),
  //       href: "/connect-wallet" as Route,
  //       name: "Connect Wallet",
  //     },
  //   ],
  // },

  // {
  //   id: ncNanoId(),
  //   href: "/about" as Route,
  //   name: "Other Pages",
  //   type: "dropdown",
  //   children: [
  //     {
  //       id: ncNanoId(),
  //       href: "/about" as Route,
  //       name: "About",
  //     },
  //     {
  //       id: ncNanoId(),
  //       href: "/contact" as Route,
  //       name: "Contact us",
  //     },

  //     {
  //       id: ncNanoId(),
  //       href: "/subscription" as Route,
  //       name: "Subscription",
  //     },
  //   ],
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/blog" as Route,
  //   name: "Blog Pages",
  //   type: "dropdown",
  //   children: [
  //     {
  //       id: ncNanoId(),
  //       href: "/blog" as Route,
  //       name: "Blog Page",
  //     },
  //     {
  //       id: ncNanoId(),
  //       href: "/blog-single" as Route,
  //       name: "Blog Single",
  //     },
  //   ],
  // },
];

export const NAVIGATION_DEMO_2: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "#",
    name: "Discover",
    type: "dropdown",
    children: otherPageChildMenus,
  },
  // {
  //   id: ncNanoId(),
  //   href: "/upload-item" as Route,
  //   name: "Help center",
  // },
];
