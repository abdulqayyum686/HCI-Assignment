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
export const getAllActivity = createAsyncThunk("getAllActivity", async () => {
  try {
    const res = await axiosInstance.get(`task/get-all-activity`);
    if (res.status === 201) {
      return res.data.activity;
    }
  } catch (err) {}
});

// post requests
export const addTask = createAsyncThunk(
  "addTask",
  async (postData, { getState }) => {
    try {
      const res = await axiosInstance.post(`task/add-task`, postData);
      // let array = [...getState().taskReducer.allUserTaskList];
      // console.log("array===1", array, res.data.task);
      // array.push(res.data.task);
      // console.log("array===", array, res.data);
      if (res.status === 201) {
        successMessage("Goal added successfully !");
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
export const addSubTask = createAsyncThunk("addSubTask", async (postData) => {
  try {
    const res = await axiosInstance.post(`task/add-sub-task`, postData);
    if (res.status === 201) {
      successMessage("Sub-goal added successfully!");
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
export const deleteTask = createAsyncThunk(
  "deleteTask",
  async (id, { getState }) => {
    try {
      const res = await axiosInstance.delete(`task/delete-task/${id}`);
      // let array = [...getState().taskReducer.allUserTaskList];
      // console.log("array===1", array, res.data.task);
      // array = array.filter((t) => t._id != id);
      // console.log("array===", array);
      if (res.status === 201) {
        successMessage("Goal added successfully !");
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
export const deleteSubTask = createAsyncThunk("deleteSubTask", async (obj) => {
  try {
    const res = await axiosInstance.delete(
      `task/delete-sub-task/${obj.id1}/${obj.id2}`
    );
    if (res.status === 201) {
      successMessage("Goal added successfully !");
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
export const updateTask = createAsyncThunk(
  "updateTask",
  async (obj, { getState }) => {
    try {
      const res = await axiosInstance.put(`task/update-task/${obj.id}`, {
        ...obj.change,
      });

      // let array = [...getState().taskReducer.allUserTaskList];
      // let index = array.findIndex((t) => t._id === obj.id);
      // let indexData = { ...array[index] };
      // indexData.status = obj.status;
      // array[index] = indexData;

      if (res.status === 201 && obj.flag === true) {
        successMessage("Goal updated successfully !");
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
export const updateSubTask = createAsyncThunk("updateSubTask", async (obj) => {
  console.log(obj);
  try {
    const res = await axiosInstance.put(
      `task/change-sub-task-status/${obj.id1}/${obj.id2}`,
      {
        status: obj.status,
        status2: obj.status2,
        type: obj.type,
      }
    );
    if (res.status === 201) {
      successMessage("Goal updated successfully !");
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
        successMessage("Sub Goal updated successfully !");
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
