import React, { useState, version } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { getCurrentUser, setCurrentUser } from "../../Redux/user";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import axiosInstance from "../../services/AxiosInstance";
import { errorMessage, successMessage } from "../../utils/message";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userReducer = useSelector((s) => s.userReducer);

  const [user, setUser] = useState({
    email: "",
    version: "1",
  });

  const handelChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handelSubmit = async () => {
    if (user.email === "") {
      alert("Email is Required");
      return;
    }
    if (user.version === "") {
      alert("Please Selec version");
      return;
    }

    axiosInstance
      .post(`user/user-login`, user)
      .then((res) => {
        axios.defaults.headers.authorization = res?.data?.token;
        axiosInstance.defaults.headers.authorization = res?.data?.token;

        dispatch(setCurrentUser(res?.data?.user));
        cookies.set("token", res?.data?.token);
        if (res?.data?.user.type === "user") {
          successMessage("User login successfull");
          navigate("/");
        } else {
          successMessage("Admin login successfull");
          navigate("/admin-users-list");
        }
      })
      .catch((e) => {
        errorMessage("Wrong credentials");
      });
  };
  return (
    <div>
      <div className="main_boxdiv">
        <div className="sign_box_div">
          {/* red portion */}
          <div className="sign_portion">
            <div className="sign_div">
              <span className="sign_text">Login</span>
            </div>
          </div>

          {/* lower portion */}

          <div className="sign_lowerdiv">
            {/* <div style={{ marginBottom: "20px" }}>
              <Dropdown>
                <Dropdown.Toggle variant="success" className="drop_down">
                  {user.version === "" ? "Select Version" : user.version}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setUser({ ...user, ["version"]: "1" })}
                  >
                    Version One
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setUser({ ...user, ["version"]: "2" })}
                  >
                    Version Two
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setUser({ ...user, ["version"]: "3" })}
                  >
                    {" "}
                    Version Three
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div> */}

            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => handelChange(e)}
              value={user.email}
              className="sign_fname sign_bot"
            />
            <br />

            <button className="sign_button" onClick={() => handelSubmit()}>
              Login
            </button>
            <p className="signs_sign">
              <Link to="/signup">
                <span className="sign_sign">Sign Up</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
