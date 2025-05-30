export interface IAppliance {
  _id: string;
  name: string;
  type: string;
  status: "available" | "in-use";
  defaultUseTime?: number; // in minutes
  createdAt: string;
  updatedAt: string;
}
export interface IUser {
  _id: string;
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
