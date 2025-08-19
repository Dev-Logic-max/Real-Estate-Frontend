import { RoleEnum } from "@/types";

export const roleMap: { [key: number]: string } = {
  [RoleEnum.Admin]: "Admin",
  [RoleEnum.User]: "User",
  [RoleEnum.Seller]: "Seller",
  [RoleEnum.Buyer]: "Buyer",
  [RoleEnum.Agent]: "Agent",
}