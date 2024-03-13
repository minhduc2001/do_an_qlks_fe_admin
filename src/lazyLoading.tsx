import React from "react";

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

export type TROLE =
  | "ROLE_ADMIN"
  | "ROLE_RECEPTIONIST"
  | "ROLE_MANAGE"
  | "ROLE_ACCOUNTANT";

export const groupPermission1: TROLE[] = ["ROLE_ADMIN", "ROLE_RECEPTIONIST"];

export const groupPermission2: TROLE[] = ["ROLE_ADMIN"];

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
    roles: ["ROLE_ADMIN"],
  },
  {
    path: "/room-management",
    component: RoomManagement,
    name: "Quản lý loại phòng",
  },
  {
    path: "/customer-management",
    component: CustomerManagement,
    name: "Quản lý khách hàng",
  },
  {
    path: "/booking-management",
    component: BookingManagement,
    name: "Quản lý đặt phòng",
  },
  {
    path: "/service-management",
    component: ServiceManagement,
    name: "Quản lý dịch vụ",
  },
  {
    path: "/promotion-management",
    component: PromotionManagement,
    name: "Quản lý khuyến mại",
  },
];
