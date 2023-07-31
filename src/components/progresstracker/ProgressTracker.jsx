import React, { useEffect, useState } from "react";
import "./progresstracker.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserTasks } from "../../Redux/task";
import Header from "../Header/Header";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

function ProgressTracker() {
  const dispatch = useDispatch();
  const userReducer = useSelector((s) => s.userReducer);
  const taskReducer = useSelector((s) => s.taskReducer);
  const [current, setCurrent] = useState(1);
  const [taskData, setTaskData] = useState([]);

  const [buttons, setButtons] = useState([
    { name: "Today" },
    { name: "Week" },
    { name: "Month" },
  ]);
  const [currentType, setCurrentType] = useState("Today");

  useEffect(() => {
    if (userReducer?.currentUser) {
      dispatch(getAllUserTasks(userReducer?.currentUser?._id));
    }
  }, [userReducer?.currentUser]);

  useEffect(() => {
    if (userReducer?.currentUser) {
      const currentDate = new Date();
      // Format the current date to match the "createdAt" format
      const currentDateString = currentDate.toISOString().split("T")[0];
      // Filter documents created today
      const filteredDocuments = taskReducer?.allUserTaskList?.filter(
        (document) => {
          const createdAtDateString = document.createdAt.split("T")[0];
          return createdAtDateString === currentDateString;
        }
      );

      setTaskData(filteredDocuments);
    }
  }, [taskReducer?.allUserTaskList]);

  const lastWeekData = () => {
    const currentDate = new Date();
    // Filter documents created today or within the last week
    const filteredDocuments = taskReducer?.allUserTaskList?.filter((d) => {
      const createdAtDate = new Date(d.createdAt);
      const diffInDays = (currentDate - createdAtDate) / (1000 * 60 * 60 * 24);
      return diffInDays <= 7;
    });
    setTaskData(filteredDocuments);
  };

  const respectiveType = (type) => {
    setCurrentType(type);
    if (type === "Today") {
      // const currentDate = new Date(new Date().getTime() + 86400000);
      const currentDate = new Date();
      // Format the current date to match the "createdAt" format
      const currentDateString = currentDate.toISOString().split("T")[0];
      // Filter documents created today
      const filteredDocuments = taskReducer?.allUserTaskList?.filter(
        (document) => {
          const createdAtDateString = document.createdAt.split("T")[0];
          return createdAtDateString === currentDateString;
        }
      );
      setTaskData(filteredDocuments);
      console.log("hassan===", filteredDocuments);
    } else if (type === "Week") {
      setCurrent(2);
      const currentDate = new Date();
      // Filter documents created today or within the last week
      const filteredDocuments = taskReducer?.allUserTaskList?.filter((d) => {
        const createdAtDate = new Date(d.createdAt);
        const diffInDays =
          (currentDate - createdAtDate) / (1000 * 60 * 60 * 24);
        return diffInDays <= 7;
      });
      setTaskData(filteredDocuments);
      console.log("hassan===", filteredDocuments);
    } else {
      setCurrent(2);
      const currentDate = new Date();
      // Filter documents created today or within the last week
      const filteredDocuments = taskReducer?.allUserTaskList?.filter((d) => {
        const createdAtDate = new Date(d.createdAt);
        const diffInDays =
          (currentDate - createdAtDate) / (1000 * 60 * 60 * 24);
        return diffInDays <= 30;
      });
      setTaskData(filteredDocuments);
    }
  };

  const array = [
    {
      name: "Progress Tracker",
      url: "/",
    },
    {
      name: "Goals",
      url: "/version1",
    },
  ];

  // chart data
  const data = [
    {
      name: "Group A",
      value: taskData?.filter(
        (f) => f.taskType === "Personal" && f.status === true
      ).length,
      // value: 1,
    },
    {
      name: "Group B",
      value: taskData?.filter(
        (f) => f.taskType === "Academic" && f.status === true
      ).length,
      // value: 2,
    },
    {
      name: "Group C",
      value: taskData?.filter((f) => f.taskType === "Misc" && f.status === true)
        .length,
      // value: 0,
    },
    {
      name: "Group D",
      value: taskData?.filter((f) => f.status === false).length,

      // value: 0,
    },
  ];

  const COLORS = ["#4141cd", "#800080", "#c554c5", "#c7abc7"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Check if all data values are 0

    return (
      <>
        {console.log(percent)}
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${percent === 0 ? "" : (percent * 100).toFixed(0)}${
            percent === 0 ? "" : "%"
          }`}
        </text>
      </>
    );
  };
  const isDataEmpty = data.every((entry) => entry.value === 0);

  const returnCount = (array, type) => {
    const count = array.reduce((accumulator, obj) => {
      if (obj.taskType === type) {
        const trueItems = obj.subTasks.filter((item) => item.status === true);
        return accumulator + trueItems.length;
      } else {
        return accumulator;
      }
    }, 0);

    console.log(count); // Output: 2
    return count;
  };
  return (
    <div>
      <div className="progress_trackmainDiv">
        <Header
          color={"palevioletred"}
          array={array}
          buttons={buttons}
          setCurrentType={respectiveType}
          currentType={currentType}
          displayButtons={true}
        />
        <div className="progress_topDiv">
          {/* <h4 className="progress_tracker">Progress Tracker</h4> */}
          {/* <div className="today_div">
            <h4
              onClick={() => todayData()}
              className={current === 1 && "today_text"}
              style={{
                fontSize: "18px",
                color: "black",
                fontWeight: "600",
                height: "80px",
                width: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              TODAY
            </h4>
            <h4
              onClick={() => lastWeekData()}
              className={current === 2 && "week_text"}
              style={{
                fontSize: "18px",
                color: "black",
                fontWeight: "600",
                height: "80px",
                width: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              WEEK
            </h4>
          </div> */}
        </div>
        {/* radial div  */}
        <div className="radial_mainDiv">
          <div className="radial_innerDiv">
            <p className="rad_cateogry">Categories</p>
            <p className="rad_goal">
              #goals <br /> completed
            </p>
            <p className="rad_goal">
              #sub-goals <br /> completed
            </p>
          </div>

          <div className="personal_div">
            <div className="persoanl_iner">
              <div className="color_round"></div>
              <p className="persoanl">Personal</p>
            </div>
            <div className="one">
              {
                taskData?.filter(
                  (f) => f.taskType === "Personal" && f.status === true
                ).length
              }
            </div>
            <div className="one">{returnCount(taskData, "Personal")}</div>
          </div>
          <div className="personal_div">
            <div className="persoanl_iner">
              <div className="color_roundacad"></div>
              <p className="persoanl">Academic</p>
            </div>
            <div className="one">
              {
                taskData?.filter(
                  (f) => f.taskType === "Academic" && f.status === true
                ).length
              }
            </div>
            <div className="one">{returnCount(taskData, "Academic")}</div>
          </div>
          <div className="personal_div">
            <div className="persoanl_iner">
              <div className="color_roundmisc"></div>
              <p className="persoanl">Misc</p>
            </div>
            <div className="one">
              {
                taskData?.filter(
                  (f) => f.taskType === "Misc" && f.status === true
                ).length
              }
            </div>
            <div className="one">{returnCount(taskData, "Misc")}</div>
          </div>

          <div className="personal_div">
            <div className="persoanl_iner" style={{ background: "#e6e1e1" }}>
              <div
                className="color_roundmisc"
                style={{ background: "#c7abc7" }}
              ></div>
              <p className="persoanl">Remaning Goals : </p>{" "}
              <div className="one" style={{ flex: 0, marginLeft: "10px" }}>
                {taskData?.filter((f) => f.status === false).length}
              </div>
            </div>

            {/* <div className="one">
              {
                taskData?.filter(
                  (f) => f.taskType === "Misc" && f.status === false
                ).length
              }
            </div> */}
          </div>
          {isDataEmpty ? (
            <div className="data_hassan">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="50%">
              <PieChart width={400} height={400}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressTracker;
