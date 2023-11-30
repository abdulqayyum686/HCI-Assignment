import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Cookies from "universal-cookie";
import UploadFile from "./components/UploadFile/UploadFile";
import ReviewerPanel from "./components/ReviewerPanel/ReviewerPanel";
import SenderPanel from "./components/SenderPanel/SenderPanel";

const cookies = new Cookies();

function App() {
  const dispatch = useDispatch();
  // const userReducer2 = useSelector((s) => s.userReducer?.currentUser);
  // const token = cookies.get("token");

  // useEffect(() => {
  //   if (token) {
  //     let user = jwt_decode(token);
  //     // dispatch(getCurrentUser(user._id));
  //     dispatch(setCurrentUser(user));
  //   }
  // }, []);

  // const UserRoutes1 = () => {
  //   const userToken =
  //     userReducer2?.type === "user" && userReducer2?.version === "1"
  //       ? true
  //       : false;
  //   console.log("user===", userReducer2);
  //   return userToken ? <Outlet /> : <Navigate to="/login" />;
  // };

  // const AdminRoutes = () => {
  //   const userToken = userReducer2?.type === "admin" ? true : false;
  //   return userToken ? <Outlet /> : <Navigate to="/login" />;
  // };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadFile />} />
        <Route path="/reviewer-panel/:id" element={<ReviewerPanel />} />
        <Route path="/sender-panel/:id" element={<SenderPanel />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        {/* <Route element={<UserRoutes1 />}>
          <Route path="/" element={<ProgressTracker />} />
          <Route path="/version1" element={<VersionOne />} />
        </Route> */}
        {/* <Route element={<AdminRoutes />}>
          <Route path="/admin-users-list" element={<Users />} />
          <Route path="/admin-task-list" element={<TaskList />} />
          <Route path="/admin-user-activity" element={<UserActivity />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
