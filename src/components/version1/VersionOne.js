import React, { useState, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
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
import { errorMessage, successMessage } from "../../utils/message";
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
    isDeleted: false,
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
    if (mainTask.taskName === "") {
      errorMessage("Plesae add goal name");
      return;
    }
    if (mainTask.taskType === "") {
      errorMessage("Plesae add goal type");
      return;
    }
    if (mainTask.completionDate === "") {
      errorMessage("Plesae add goal completion date");
      return;
    }

    let res = await dispatch(
      addTask({
        ...mainTask,
        version: userReducer.currentUser.version,
        belongsTo: userReducer.currentUser._id,
        completionDate: new Date(mainTask.completionDate),
      })
    );
    if (res.payload) {
      let array = [...tabelData];
      array.push(res.payload.task);
      // console.log("array===", res.payload.task);
      setTabelData(array);
      setMainTask({
        taskName: "",
        taskType: "Academic",
        completionDate: "",
        diff: "",
        inputData: "",
      });
    }
    handleClose();
  };
  const addSubTask2 = async () => {
    if (subTask.name === "") {
      errorMessage("Plesae add sub-goal name");
      return;
    }
    if (subTask.completionDate === "") {
      errorMessage("Plesae add sub-goal completion date");
      return;
    }
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
      // dispatch(getAllUserTasks(userReducer?.currentUser?._id));\
      setSubTask({
        name: "",
        status: false,
        status2: false,
        completionDate: "",
        diff: "",
      });
      getData();
    }
    setSubTask({ ...subTask, name: "" });
    handleCloseSubTask();
  };

  const deleteMaintask = async (task, type) => {
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
        if (type === "deleteMainTask") {
          successMessage("Deleted with time");
        }
        let array = [...tabelData];
        array = array.filter((t) => t._id != task._id);
        console.log("array===", array);
        setTabelData(array);
        // let res = await dispatch(deleteTask(task._id));
        let res = await dispatch(
          updateTask({
            id: task._id,
            change: { ...task, isDeleted: true, type },
          })
        );
      }
    });
  };
  const delSubTask = async (task, subtask, index, ind, type) => {
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
        if (type === "deleteSubTask") {
          successMessage("Deleted with time");
        }
        let array = [...tabelData];
        let indexData = { ...array[index] };

        let cloneSubTasks = [...array[index].subTasks];
        cloneSubTasks[ind] = {
          ...cloneSubTasks[ind],
          isDeleted: true,
        };

        indexData.subTasks = cloneSubTasks;

        array[index] = indexData;
        setTabelData(array);
        let res = await dispatch(
          updateTask({
            id: task._id,
            change: { subTasks: cloneSubTasks, type },
          })
        );
        // let res = await dispatch(
        //   deleteSubTask({
        //     id1: task._id,
        //     id2: subtask._id,
        //   })
        // );

        if (res.payload) {
          // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
          getData();
        }
      }
    });
  };
  const changeSubTaskStatus = async (task, subtask, index, ind) => {
    let array = [...tabelData];
    let indexData = { ...array[index] };

    let cloneSubTasks = [...array[index].subTasks];
    cloneSubTasks[ind] = {
      ...cloneSubTasks[ind],
      status: !subtask.status,
    };

    indexData.subTasks = cloneSubTasks;

    array[index] = indexData;
    setTabelData(array);

    if (!subtask.status === true) {
      let res = await dispatch(
        updateSubTask({
          id1: task._id,
          id2: subtask._id,
          status: !subtask.status,
          status2: subtask.status2,
          type: "checkSubTaskStatus1",
        })
      );
      successMessage("Complete with time");
    }
    if (!subtask.status === false) {
      let res = await dispatch(
        updateSubTask({
          id1: task._id,
          id2: subtask._id,
          status: !subtask.status,
          status2: subtask.status2,
          type: "unCheckSubTaskStatus1",
        })
      );
      successMessage("incomplete with time");
    }

    // if (res.payload) {
    //   // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
    //   getData();
    // }
  };
  const changeSubTaskStatus2 = async (task, subtask, index, ind) => {
    let array = [...tabelData];
    let indexData = { ...array[index] };

    let cloneSubTasks = [...array[index].subTasks];
    cloneSubTasks[ind] = {
      ...cloneSubTasks[ind],
      status2: !subtask.status2,
    };

    indexData.subTasks = cloneSubTasks;

    array[index] = indexData;
    setTabelData(array);
    if (!subtask.status2 === true) {
      let res = await dispatch(
        updateSubTask({
          id1: task._id,
          id2: subtask._id,
          status: subtask.status,
          status2: !subtask.status2,
          type: "checkSubTaskStatus2",
        })
      );
      successMessage("Complete with time");
    }
    if (!subtask.status2 === false) {
      let res = await dispatch(
        updateSubTask({
          id1: task._id,
          id2: subtask._id,
          status: subtask.status,
          status2: !subtask.status2,
          type: "unCheckSubTaskStatus2",
        })
      );
      successMessage("incomplete with time");
    }

    // if (res.payload) {
    //   // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
    //   getData();
    // }
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
      diff: daysDifference + 1,
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
      diff: daysDifference + 1,
    });
  };

  const calculateDif = (item) => {
    // let start = moment().add(1, "day");
    let start = moment();
    let end = moment(item.completionDate);
    let duration = moment.duration(end.diff(start));
    let days = Math.ceil(duration.asDays());

    if (item.status) {
      return 100;
    } else if (days != 0) {
      let value = ((item.diff - days) / item.diff) * 100;
      return value;
    } else {
      return 100;
    }
  };
  const calculateDifSat = (data) => {
    // let start = moment().add(1, "day");
    let start = moment();
    let end = moment(data.completionDate);
    let duration = moment.duration(end.diff(start));
    let days = Math.ceil(duration.asDays());

    console.log("daysDifference", days, duration.asDays());
    if (data.status) {
      return 100;
    } else if (days != 0) {
      let value = ((data.diff - days) / data.diff) * 100;
      console.log("value==", value);
      return value;
    } else {
      return 100;
    }
  };

  const handelChecked = async (task, type) => {
    let status = task.status === true ? false : true;
    let status2 = task.status2;
    let array = [...tabelData];
    let index = array.findIndex((t) => t._id === task._id);
    let indexData = { ...array[index] };
    indexData.status = status;
    if (status) {
      indexData.subTasks = indexData.subTasks.map((obj) => ({
        ...obj,
        status: true,
      }));
    }

    array[index] = indexData;
    setTabelData(array);
    console.log("type", status);
    if (status === true) {
      let res = await dispatch(
        updateTask({
          id: task._id,
          change: { status, status2, flag: true, type: "checkMainStatus1" },
        })
      );

      successMessage("Complete with time");
    }
    if (status === false) {
      successMessage("Incomplete with time");
      let res = await dispatch(
        updateTask({
          id: task._id,
          change: { status, status2, flag: true, type: "unCheckMainStatus1" },
        })
      );
    }
  };
  const handelCheckedSat = async (task) => {
    let status = task.status;
    let status2 = task.status2 === true ? false : true;
    let array = [...tabelData];
    let index = array.findIndex((t) => t._id === task._id);
    let indexData = { ...array[index] };
    indexData.status2 = status2;
    if (status2) {
      indexData.subTasks = indexData.subTasks.map((obj) => ({
        ...obj,
        status2: true,
      }));
    }

    array[index] = indexData;
    setTabelData(array);
    if (status2 === true) {
      let res = await dispatch(
        updateTask({
          id: task._id,
          change: { status, status2, flag: false, type: "checkMainStatus2" },
        })
      );
      successMessage("Complete with time");
    }
    if (status2 === false) {
      let res = await dispatch(
        updateTask({
          id: task._id,
          change: { status, status2, flag: false, type: "unCheckMainStatus2" },
        })
      );
      successMessage("Incomplete with time");
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
        {/* {taskReducer.allUserTaskList */}
        {tabelData
          ?.filter((t) => t.taskType === currentType)
          ?.map((data, index) => {
            return (
              <div key={index}>
                <div className="checkbox_Div">
                  <div className="checkBox_1" style={{ marginTop: "0px" }}>
                    <input
                      className=""
                      type="checkbox"
                      onChange={(e) =>
                        handelChecked(
                          data
                          // data.status2 === true
                          //   ? "checkMainStatus1"
                          //   : "unCheckMainStatus1"
                        )
                      }
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
                      onChange={(e) =>
                        handelCheckedSat(
                          data
                          // data.status2 === true
                          //   ? "checkMainStatus2"
                          //   : "unCheckMainStatus2"
                        )
                      }
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
                        <GiHamburgerMenu
                          style={{
                            color: "#cc1a54",
                            cursor: "pointer",
                            marginTop: "-20px",
                            // flex: 1,
                          }}
                          size={30}
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => deleteMaintask(data, "deleteMainTask")}
                        >
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
                            onChange={() =>
                              changeSubTaskStatus(data, item, index, ind)
                            }
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
                            onChange={() =>
                              changeSubTaskStatus2(data, item, index, ind)
                            }
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
                              <GiHamburgerMenu
                                style={{
                                  color: "#cc1a54",
                                  cursor: "pointer",
                                  marginTop: "-20px",
                                  // flex: 1,
                                }}
                                size={30}
                              />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  delSubTask(
                                    data,
                                    item,
                                    index,
                                    ind,
                                    "deleteSubTask"
                                  )
                                }
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
