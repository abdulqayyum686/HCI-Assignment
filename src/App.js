import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import SignUp from "../src/components/signup/SignUp";
import ProgressTracker from "../src/components/progresstracker/ProgressTracker";
import VersionOne from "../src/components/version1/VersionOne";
import Users from "../src/components/admin/Users";
import TaskList from "../src/components/admin/TaskList";
import Login from "./components/login/Login";
import { getCurrentUser, setCurrentUser } from "./Redux/user";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "universal-cookie";

const cookies = new Cookies();

function App() {
  const dispatch = useDispatch();
  const userReducer2 = useSelector((s) => s.userReducer?.currentUser);
  const token = cookies.get("token");

  useEffect(() => {
    if (token) {
      let user = jwt_decode(token);
      // dispatch(getCurrentUser(user._id));
      dispatch(setCurrentUser(user));
    }
  }, []);

  const UserRoutes1 = () => {
    const userToken =
      userReducer2?.type === "user" && userReducer2?.version === "1"
        ? true
        : false;
    console.log("user===", userReducer2);
    return userToken ? <Outlet /> : <Navigate to="/login" />;
  };

  const AdminRoutes = () => {
    const userToken = userReducer2?.type === "admin" ? true : false;
    return userToken ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<UserRoutes1 />}>
          <Route path="/" element={<ProgressTracker />} />
          <Route path="/version1" element={<VersionOne />} />
        </Route>
        <Route element={<AdminRoutes />}>
          <Route path="/admin-users-list" element={<Users />} />
          <Route path="/admin-task-list" element={<TaskList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
