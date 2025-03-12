import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Socket } from "socket.io-client";

const initialState: {
  socketConnection: Socket | null;
} = {
  socketConnection: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

export const selectSocketConnection = (state: RootState) =>
  state.messages.socketConnection;

export const { setSocketConnection } = messagesSlice.actions;
export default messagesSlice.reducer;
