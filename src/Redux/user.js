import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/AxiosInstance";
import { successMessage, errorMessage } from "../utils/message";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const initialState = {
  currentUser: null,
  allUsers: [],
  active: 0,
};
// get requests
export const getAllUsers = createAsyncThunk("getAllUsers", async () => {
  try {
    const res = await axiosInstance.get(`user/get-all-users`);
    if (res.status === 201) {
      return res.data.users;
    }
  } catch (err) {}
});
export const getCurrentUser = createAsyncThunk("getCurrentUser", async (id) => {
  try {
    const res = await axiosInstance.get(`user/get-current-user/${id}`);
    if (res.status === 201) {
      return res.data.user;
    }
  } catch (err) {}
});

//post requests
export const userSignUp = createAsyncThunk("userSignUp", async (formData) => {
  try {
    const res = await axiosInstance.post(`user/user-signup`, formData);
    if (res.status === 201) {
      successMessage("User successfully registered");
      return res;
    }
    return res;
  } catch (err) {
    errorMessage(err.response.data || err.message);
  }
});

//update Requests

export const deleteUser = createAsyncThunk("deleteUser", async (id) => {
  try {
    const res = await axiosInstance.delete(`user/delete-user/${id}`);
    if (res.status === 200) {
      successMessage("user deleted successfully !");
    }
    return res.data;
  } catch (err) {
    errorMessage(
      err.response.data.message
        ? err.response.data.message
        : err.response.data || err.message
    );
  }
});

export const userReducer = createSlice({
  name: "userReducer",
  initialState: initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    resetCurrentUser(state, action) {
      state.currentUser = null;
    },
    setActive(state, action) {
      state.active = action.payload;
    },
  },
  extraReducers: {
    [getAllUsers.fulfilled]: (state, action) => {
      state.allUsers = action.payload;
    },
    [userSignUp.fulfilled]: (state, action) => {
      state.isloading = false;
    },
    [userSignUp.pending]: (state, action) => {
      state.isloading = true;
    },

    [getCurrentUser.fulfilled]: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});
// Action creators are generated for each case reducer function
export const { setCurrentUser, resetCurrentUser, setActive } =
  userReducer.actions;
export default userReducer.reducer;
