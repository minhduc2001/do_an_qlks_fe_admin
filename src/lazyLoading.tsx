import React from "react";
import { TbHomeStats } from "react-icons/tb";
import { MdMeetingRoom } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { TbBrandBooking } from "react-icons/tb";
import { FcServices } from "react-icons/fc";
import { MdDiscount } from "react-icons/md";

const RoomManagement = React.lazy(() => import("@/pages/room-management"));
const BookingManagement = React.lazy(
  () => import("@/pages/booking-management")
);
const CustomerManagement = React.lazy(
  () => import("@/pages/customer-management")
);
const ServiceManagement = React.lazy(
  () => import("@/pages/service-management")
);
const PromotionManagement = React.lazy(
  () => import("@/pages/promotion-management")
);
const Statistic = React.lazy(() => import("@/pages/statistic"));

export type TROLE = "ROLE_ADMIN" | "ROLE_RECEPTIONIST" | "ROLE_ACCOUNTANT";

export const groupPermission1: TROLE[] = ["ROLE_ADMIN", "ROLE_RECEPTIONIST"];
export const groupPermission2: TROLE[] = ["ROLE_ADMIN"];
export const groupPermission3: TROLE[] = ["ROLE_ADMIN", "ROLE_ACCOUNTANT"];

export function checkPermission(
  groupPermission: TROLE[],
  userRole?: (TROLE | undefined)[]
) {
  if (userRole?.[0]) {
    return groupPermission.includes(userRole?.[0]);
  }
  return false;
}

export interface IRoute {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  name: string;
  icon?: React.ReactNode;
  roles?: string[];
}

export const PUBLIC_ROUTES: IRoute[] = [
  {
    path: "/statistic",
    component: Statistic,
    name: "Thống kê",
    roles: ["ROLE_ADMIN", "ROLE_ACCOUNTANT"],
    icon: <TbHomeStats />,
  },
  {
    path: "/room-management",
    component: RoomManagement,
    name: "Quản lý loại phòng",
    icon: <MdMeetingRoom />,
    roles: ["ROLE_ADMIN", "ROLE_RECEPTIONIST"],
  },
  {
    path: "/customer-management",
    component: CustomerManagement,
    name: "Quản lý đối tượng",
    icon: <RiCustomerService2Fill />,
    roles: ["ROLE_ADMIN", "ROLE_RECEPTIONIST"],
  },
  {
    path: "/booking-management",
    component: BookingManagement,
    name: "Quản lý đặt phòng",
    icon: <TbBrandBooking />,
    roles: ["ROLE_ADMIN", "ROLE_RECEPTIONIST"],
  },
  {
    path: "/service-management",
    component: ServiceManagement,
    name: "Quản lý dịch vụ",
    icon: <FcServices />,
    roles: ["ROLE_ADMIN", "ROLE_RECEPTIONIST"],
  },
  {
    path: "/promotion-management",
    component: PromotionManagement,
    name: "Quản lý khuyến mại",
    icon: <MdDiscount />,
    roles: ["ROLE_ADMIN", "ROLE_RECEPTIONIST"],
  },
];
