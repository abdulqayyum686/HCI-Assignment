import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/AxiosInstance";
import axios from "axios";
import { successMessage, errorMessage } from "../utils/message";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const initialState = {
  allUserTaskList: [],
  taskList: [],
};
// get requests

export const getAllUserTasks = createAsyncThunk(
  "getAllUserTasks",
  async (id) => {
    try {
      const res = await axiosInstance.get(`task/get-all-user-tasks/${id}`);
      if (res.status === 201) {
        return res.data.tasks;
      }
    } catch (err) {}
  }
);
export const getAllTasks = createAsyncThunk("getAllTasks", async () => {
  try {
    const res = await axiosInstance.get(`task/get-all-tasks`);
    if (res.status === 201) {
      return res.data.tasks;
    }
  } catch (err) {}
});

// post requests
export const addTask = createAsyncThunk("addTask", async (postData) => {
  try {
    const res = await axiosInstance.post(`task/add-task`, postData);
    if (res.status === 201) {
      successMessage("Task added successfully !");
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
export const addSubTask = createAsyncThunk("addSubTask", async (postData) => {
  try {
    const res = await axiosInstance.post(`task/add-sub-task`, postData);
    if (res.status === 201) {
      successMessage("Sub-task added successfully!");
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
// delete requests
export const deleteTask = createAsyncThunk("deleteTask", async (id) => {
  try {
    const res = await axiosInstance.delete(`task/delete-task/${id}`);
    if (res.status === 201) {
      successMessage("Task added successfully !");
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
export const deleteSubTask = createAsyncThunk("deleteSubTask", async (obj) => {
  try {
    const res = await axiosInstance.delete(
      `task/delete-sub-task/${obj.id1}/${obj.id2}`
    );
    if (res.status === 201) {
      successMessage("Task added successfully !");
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
// update requests
export const updateTask = createAsyncThunk("updateTask", async (obj) => {
  console.log(obj);
  try {
    const res = await axiosInstance.put(`task/update-task/${obj.id}`, {
      status: obj.status,
      status2: obj.status2,
      inputData: obj.inputData,
    });
    if (res.status === 201 && obj.flag === true) {
      successMessage("Task updated successfully !");
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
export const updateSubTask = createAsyncThunk("updateSubTask", async (obj) => {
  console.log(obj);
  try {
    const res = await axiosInstance.put(
      `task/change-sub-task-status/${obj.id1}/${obj.id2}`,
      {
        status: obj.status,
        status2: obj.status2,
      }
    );
    if (res.status === 201) {
      successMessage("Sub Task updated successfully !");
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
export const updateSubTaskInputData = createAsyncThunk(
  "updateSubTaskInputData",
  async (obj) => {
    console.log(obj);
    try {
      const res = await axiosInstance.put(
        `task/change-sub-task-input-data/${obj.id1}/${obj.id2}`,
        {
          inputData: obj.inputData,
        }
      );
      if (res.status === 201) {
        successMessage("Sub Task updated successfully !");
      }
      return res.data;
    } catch (err) {
      errorMessage(
        err.response.data.message
          ? err.response.data.message
          : err.response.data || err.message
      );
    }
  }
);

export const taskReducer = createSlice({
  name: "taskReducer",
  initialState: initialState,
  reducers: {
    // setCurrentUser(state, action) {
    //   state.currentUser = action.payload;
    // },
  },
  extraReducers: {
    [getAllUserTasks.fulfilled]: (state, action) => {
      state.allUserTaskList = action.payload;
    },
    [getAllTasks.fulfilled]: (state, action) => {
      state.taskList = action.payload;
    },
  },
});
// Action creators are generated for each case reducer function
export const {} = taskReducer.actions;
export default taskReducer.reducer;
