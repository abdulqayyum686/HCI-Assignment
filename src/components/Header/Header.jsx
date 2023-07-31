import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import "./header.css";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { setActive } from "../../Redux/user";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const cookies = new Cookies();
const Header = ({
  color,
  array,
  buttons,
  setCurrentType,
  currentType,
  displayButtons,
  type,
}) => {
  const userReducer = useSelector((store) => store.userReducer);
  const dispatch = useDispatch();
  const history = useNavigate();

  function remove() {
    console.log("logged in");
    cookies.remove("token");
    history("/login");
    dispatch(setActive(0));
  }

  const handelActive = (index, data) => {
    dispatch(setActive(index));
    history(data.url);
  };

  return (
    <div
      className={"header"}
      // style={{ background: color }}
    >
      <div className="">
        <div className="header_first">
          <div className="inner_first">
            Tutorial
            <OverlayTrigger
              placement="right"
              delay={{ hide: 450, show: 300 }}
              overlay={(props) => (
                <Tooltip
                  {...props}
                  className="custom-tooltip"
                  // placement="right"
                >
                  <div className="text-start">
                    <div>
                      - Use this platform to keep track of your day-to-day
                      goals.
                    </div>
                    <div>
                      - Use the '+' button at the bottom right of the screen to
                      add your goals.
                    </div>
                    <div>
                      - After adding a goal, use the menu on the right to add
                      new sub-goal(s) or delete a goal.
                    </div>
                    <div>
                      - Pick a completion date for every goal or sub-goal.
                    </div>
                    <div>
                      - The progress bar on every goal indicates the completion
                      percentage, starting from the day of addition of the goal.
                    </div>
                    <div>
                      - The progress tracker screen provides feedback on the
                      number of goals and sub-goals completed and the number of
                      goals and sub-goals remaining.
                    </div>
                    <div>
                      - Use the input box below every goal to describe the
                      importance of a particular goal to you.
                    </div>
                    <div>
                      - Use the checkbox on the right of each goal to indicate
                      that the task progress is satisfactory. The task is not
                      100% complete but, the progress is satisfactory for now.
                    </div>
                  </div>
                </Tooltip>
              )}
            >
              <Button className="tool_tip">
                {" "}
                <AiOutlineExclamationCircle size={20} />
              </Button>
            </OverlayTrigger>
          </div>
          <div className="inner_first" onClick={(e) => remove()}>
            Sign Out
          </div>
        </div>
        <div className="header_second">
          {array?.map((data, index) => {
            return (
              <Button
                className="header_second_button"
                style={{
                  borderBottom:
                    userReducer?.active !== index ? "1px solid black" : "",
                  borderRight:
                    index === 0 || (index === 1 && type === "admin")
                      ? "1px solid black"
                      : "",
                }}
                key={index}
                onClick={() => handelActive(index, data)}
              >
                {data.name}
              </Button>
            );
          })}
        </div>
        {displayButtons && (
          <div className="buttons_taskDiv">
            {buttons.map((itm, index) => {
              return (
                <button
                  className="button_text"
                  key={index}
                  onClick={() => setCurrentType(itm.name)}
                  style={{
                    color: currentType === itm.name ? "palevioletred" : "",
                  }}
                >
                  {itm.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
