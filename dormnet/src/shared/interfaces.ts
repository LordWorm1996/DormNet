export interface IAppliance {
  _id: string;
  name: string;
  type: string;
  status: "available" | "in-use";
  defaultUseTime?: number; // in minutes (optional)
  createdAt: string;
  updatedAt: string;
}
export interface IUser {
  name: string;
  email: string;
}

export interface IReservation {
  _id: string;
  user: IUser;
  appliance: IAppliance;
  startTime: string;
  endTime: string;
  status: "active" | "completed" | "cancelled";
}
