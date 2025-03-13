export interface IMessage {
  _id: string;
  message: string;
  sender: string; // Assuming sender and receiver are user IDs
  receiver: string;
  seen: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
