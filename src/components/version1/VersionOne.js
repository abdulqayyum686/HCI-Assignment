import React, { useState, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFilterRight } from "react-icons/bs";
import { BsFillPlusSquareFill } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./VersionOne.css";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "react-bootstrap/ProgressBar";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import {
  getAllUserTasks,
  addTask,
  deleteTask,
  updateTask,
  addSubTask,
  deleteSubTask,
  updateSubTask,
  updateSubTaskInputData,
} from "../../Redux/task";
import Swal from "sweetalert2";
import moment from "moment";
function VersionOne() {
  const dispatch = useDispatch();
  const userReducer = useSelector((s) => s.userReducer);
  const taskReducer = useSelector((s) => s.taskReducer);
  const [currentType, setCurrentType] = useState("Academic");
  const [tabelData, setTabelData] = useState([]);

  const [taskId, setTaskId] = useState("");

  const [mainTask, setMainTask] = useState({
    taskName: "",
    taskType: "Academic",
    completionDate: "",
    diff: "",
    inputData: "",
  });

  const [subTask, setSubTask] = useState({
    name: "",
    status: false,
    status2: false,
    // inputData: "",
    completionDate: "",
    diff: "",
  });
  const [buttons, setButtons] = useState([
    { name: "Academic" },
    { name: "Personal" },
    { name: "Misc" },
  ]);

  const [showSubTask, setShowSubTask] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseSubTask = () => setShowSubTask(false);
  const handleShowSubTask = (task) => {
    setShowSubTask(true);
    setTaskId(task._id);
  };
  const getData = async () => {
    if (userReducer?.currentUser) {
      let res = await dispatch(getAllUserTasks(userReducer?.currentUser?._id));
      setTabelData(res.payload);
    }
  };
  useEffect(() => {
    getData();
  }, [userReducer?.currentUser]);
  // useEffect(() => {
  //   if (ID === true) {
  //     setID(false);
  //   }
  // }, [ID]);

  const addMainTask = async () => {
    let res = await dispatch(
      addTask({
        ...mainTask,
        version: userReducer.currentUser.version,
        belongsTo: userReducer.currentUser._id,
        completionDate: new Date(mainTask.completionDate),
      })
    );
    if (res.payload) {
      // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
      getData();
    }
    handleClose();
  };

  const addSubTask2 = async () => {
    let res = await dispatch(
      addSubTask({
        taskId,
        taskObject: {
          ...subTask,
          completionDate: new Date(subTask.completionDate),
        },
      })
    );
    if (res.payload) {
      // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
      getData();
    }
    setSubTask({ ...subTask, name: "" });
    handleCloseSubTask();
  };

  const deleteMaintask = async (task) => {
    Swal.fire({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await dispatch(deleteTask(task._id));
        if (res.payload) {
          // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
          getData();
        }
      }
    });
  };
  const delSubTask = async (task, subtask) => {
    Swal.fire({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await dispatch(
          deleteSubTask({
            id1: task._id,
            id2: subtask._id,
          })
        );
        if (res.payload) {
          // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
          getData();
        }
      }
    });
  };
  const changeSubTaskStatus = async (task, subtask) => {
    let res = await dispatch(
      updateSubTask({
        id1: task._id,
        id2: subtask._id,
        status: !subtask.status,
        status2: subtask.status2,
      })
    );
    if (res.payload) {
      // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
      getData();
    }
  };
  const changeSubTaskStatus2 = async (task, subtask) => {
    let res = await dispatch(
      updateSubTask({
        id1: task._id,
        id2: subtask._id,
        status: subtask.status,
        status2: !subtask.status2,
      })
    );
    if (res.payload) {
      // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
      getData();
    }
  };
  const changeMainTaskInput = async (e, task) => {
    setTabelData((prevData) =>
      prevData.map((item) =>
        item._id === task._id ? { ...item, inputData: e.target.value } : item
      )
    );

    let res = await dispatch(
      updateTask({
        id: task._id,
        status: task.status,
        status2: task.status2,
        inputData: e.target.value,
        flag: false,
      })
    );
    if (res.payload) {
      // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
      getData();
    }
  };

  const handelChange = (e) => {
    setMainTask({ ...mainTask, [e.target.name]: e.target.value });
  };
  const handelChangeSubTask = (e) => {
    setSubTask({ ...subTask, [e.target.name]: e.target.value });
  };
  const handelChangeSubTaskDate = (e) => {
    const startDateTime = new Date();
    const endDateTime = new Date(e.target.value);

    const timeDifference = endDateTime.getTime() - startDateTime.getTime();
    // Calculate the difference in days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    setSubTask({
      ...subTask,
      [e.target.name]: e.target.value,
      diff: daysDifference,
    });
  };
  const handelChangeMainTaskDate = (e) => {
    const startDateTime = new Date();
    const endDateTime = new Date(e.target.value);

    const timeDifference = endDateTime.getTime() - startDateTime.getTime();
    // Calculate the difference in days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    setMainTask({
      ...mainTask,
      [e.target.name]: e.target.value,
      diff: daysDifference,
    });
  };

  const calculateDif = (item) => {
    const startDateTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const endDateTime = new Date(item.completionDate);

    const timeDifference = endDateTime.getTime() - startDateTime.getTime();
    // Calculate the difference in days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    if (item.status) {
      return 100;
    } else if (daysDifference != 0) {
      let value = ((item.diff - daysDifference) / item.diff) * 100;
      return value;
    } else {
      return 100;
    }
  };
  const calculateDifSat = (data) => {
    const startDateTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const endDateTime = new Date(data.completionDate);

    const timeDifference = endDateTime.getTime() - startDateTime.getTime();
    // Calculate the difference in days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    if (data.status) {
      return 100;
    } else if (daysDifference != 0) {
      let value = ((data.diff - daysDifference) / data.diff) * 100;
      return value;
    } else {
      return 100;
    }
  };

  const handelChecked = async (task) => {
    let status = task.status === true ? false : true;
    let status2 = task.status2;
    let res = await dispatch(
      updateTask({ id: task._id, status, status2, flag: true })
    );
    if (res.payload) {
      // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
      getData();
    }
  };
  const handelCheckedSat = async (task) => {
    let status = task.status;
    let status2 = task.status2 === true ? false : true;
    let res = await dispatch(
      updateTask({ id: task._id, status, status2, flag: true })
    );
    if (res.payload) {
      // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
      getData();
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
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="version_onemainDiv" style={{ position: "relative" }}>
        <Header
          array={array}
          buttons={buttons}
          setCurrentType={setCurrentType}
          currentType={currentType}
          displayButtons={true}
        />

        {/* modal */}
        <Modal show={show} onHide={handleClose} animation={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Goal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="input_oneDiv">
              <label className="tasks_name" for="">
                Goal:
              </label>
              <input
                className="task_nameinput"
                type="text"
                name="taskName"
                value={mainTask.taskName}
                onChange={(e) => handelChange(e)}
                placeholder="Goal Name"
              />
            </div>
            <br />

            <div className="input_oneDiv">
              <label className="choose_task" for="">
                Choose Goal Type:
              </label>
              <select
                className="task_nameinput"
                name="taskType"
                id=""
                required
                onChange={(e) => handelChange(e)}
              >
                <option value="Academic">Academic</option>
                <option value="Personal">Personal</option>
                <option value="Misc">Misc</option>
              </select>
            </div>
            <br />
            <div className="input_oneDiv ">
              <label className="tasks_name" for="">
                Completion Date:
              </label>
              <input
                className="task_nameinput"
                type="date"
                name="completionDate"
                min={currentDate}
                value={mainTask.completionDate}
                onChange={(e) => handelChangeMainTaskDate(e)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => addMainTask()}>
              Add Goal
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showSubTask}
          onHide={handleCloseSubTask}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Sub Goal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="input_oneDiv">
              <label className="tasks_name" for="">
                Goal :
              </label>
              <input
                className="task_nameinput"
                type="text"
                name="name"
                value={subTask.name}
                onChange={(e) => handelChangeSubTask(e)}
                placeholder="Goal Name"
              />
            </div>
            {/* <br />
            <div className="input_oneDiv ">
              <label className="tasks_name" for="">
                Input Data:
              </label>
              <input
                className="task_nameinput"
                type="text"
                name="inputData"
                value={subTask.inputData}
                onChange={(e) => handelChangeSubTask(e)}
                placeholder="Enter  input data"
              />
            </div> */}
            <br />
            <div className="input_oneDiv ">
              <label className="tasks_name" for="">
                Completion Date:
              </label>
              <input
                className="task_nameinput"
                type="date"
                name="completionDate"
                min={currentDate}
                value={subTask.completionDate}
                onChange={(e) => handelChangeSubTaskDate(e)}
              />
            </div>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => addSubTask2()}>
              Add Sub Goal
            </Button>
          </Modal.Footer>
        </Modal>
        {/* 1stcheck */}
        {/* {taskReducer?.allUserTaskList */}
        {tabelData
          ?.filter((t) => t.taskType === currentType)
          ?.map((data, index) => {
            return (
              <div>
                <div className="checkbox_Div" key={index}>
                  <div className="checkBox_1" style={{ marginTop: "0px" }}>
                    <input
                      className=""
                      type="checkbox"
                      onChange={(e) => handelChecked(data)}
                      checked={data.status}
                    />
                  </div>
                  <div>
                    <h5
                      className="hci_texte"
                      style={{
                        background: data.status === true ? "#A6FF33" : "",
                      }}
                    >
                      {data.taskName.slice(0, 17) + " " + "..."}
                    </h5>

                    <ProgressBar
                      now={calculateDifSat(data)}
                      className={
                        data.status2 === true
                          ? "progress-bar23"
                          : "progress-bar2"
                      }
                      style={{
                        height: "25px",
                        fontSize: "20px",
                        width: "200px",
                      }}
                    />
                    <textarea
                      className="goal_para"
                      placeholder="What is the importance of this goal to you?"
                      value={data.inputData}
                      onChange={(e) => changeMainTaskInput(e, data)}
                    />
                  </div>

                  <div className="checkBox_2 my_data">
                    <input
                      className="checkbox_2"
                      type="checkbox"
                      onChange={(e) => handelCheckedSat(data)}
                      checked={data.status2}
                    />
                    <p className="satis">
                      Satisfactory?{" "}
                      <OverlayTrigger
                        delay={{ hide: 450, show: 300 }}
                        overlay={(props) => (
                          <Tooltip {...props}>
                            <div className="text-start ">
                              Use this checkbox to indicate that the goal
                              progress is satisfactory. The goal is not 100%
                              complete but, the progress is satisfactory for
                              now.
                            </div>
                          </Tooltip>
                        )}
                        placement="bottom"
                      >
                        <Button
                          className="tool_tip"
                          style={{ marginLeft: "0px" }}
                        >
                          <AiOutlineExclamationCircle size={20} />
                        </Button>
                      </OverlayTrigger>
                    </p>
                  </div>
                  <div className="date_div">
                    <p className="date_text">
                      {moment(data.completionDate).format("YYYY-MM-DD")}
                    </p>
                  </div>

                  <div>
                    <Dropdown drop="start">
                      <Dropdown.Toggle style={{ background: "none" }}>
                        <BsFilterRight
                          style={{
                            color: "#cc1a54",
                            cursor: "pointer",
                            marginTop: "-6px",
                            // flex: 1,
                          }}
                          size={30}
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => deleteMaintask(data)}>
                          Delete Main Goal
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => handleShowSubTask(data)}>
                          Add new Sub Goal
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                {/* 2ndcheck */}
                {data.subTasks.map((item, ind) => {
                  return (
                    <>
                      <div className="checkbox_Dive" key={ind}>
                        <div className="checkBox_1">
                          <input
                            className="checkbox_1"
                            type="checkbox"
                            checked={item.status}
                            onChange={() => changeSubTaskStatus(data, item)}
                          />
                        </div>
                        <div className="check2_text">
                          <div className="udst_div">
                            <div>
                              <h5
                                className="hci_texte"
                                style={{
                                  background:
                                    item.status === true ? "#A6FF33" : "",
                                }}
                              >
                                {item.name.slice(0, 17) + " " + "..."}
                              </h5>
                              <ProgressBar
                                now={calculateDif(item)}
                                className={
                                  item.status2 === true
                                    ? "progress-bar23"
                                    : "progress-bar2"
                                }
                                style={{
                                  height: "25px",
                                  fontSize: "20px",
                                  width: "200px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="checkBox_2 my_data">
                          <input
                            className="checkbox_2"
                            type="checkbox"
                            checked={item.status2}
                            onChange={() => changeSubTaskStatus2(data, item)}
                          />
                          <p className="satis">
                            Satisfactory?{" "}
                            <OverlayTrigger
                              delay={{ hide: 450, show: 300 }}
                              overlay={(props) => (
                                <Tooltip {...props}>
                                  <div className="text-start">
                                    Use this checkbox to indicate that the goal
                                    progress is satisfactory. The goal is not
                                    100% complete but, the progress is
                                    satisfactory for now.
                                  </div>
                                </Tooltip>
                              )}
                              placement="bottom"
                            >
                              <Button
                                className="tool_tip"
                                style={{ marginLeft: "0px" }}
                              >
                                <AiOutlineExclamationCircle size={20} />
                              </Button>
                            </OverlayTrigger>
                          </p>
                        </div>
                        <div className="date_div">
                          <p className="date_text">
                            {moment(item.completionDate).format("YYYY-MM-DD")}
                          </p>
                        </div>
                        <div>
                          <Dropdown drop="start">
                            <Dropdown.Toggle style={{ background: "none" }}>
                              <BsFilterRight
                                style={{
                                  color: "#cc1a54",
                                  cursor: "pointer",
                                  marginTop: "-6px",
                                  // flex: 1,
                                }}
                                size={30}
                              />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => delSubTask(data, item)}
                              >
                                Delete Sub Goal
                              </Dropdown.Item>
                              {/* <Dropdown.Divider /> */}
                              {/* <Dropdown.Item
                                onClick={() => handleShowSubTask(data)}
                              >
                                Add new Sub Task
                              </Dropdown.Item> */}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            );
          })}
        <AiFillPlusCircle
          size={40}
          className="bottom_icon"
          onClick={handleShow}
        />
      </div>
    </div>
  );
}

export default VersionOne;
