import { createContext,useReducer } from "react";

const initialValue = {
    accessToken: "",
    username: "",
    userId: "",
}

export const authContext = createContext(initialValue)
