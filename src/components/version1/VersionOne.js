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

  const [updateManin, setUpdateMain] = useState(false);
  const [updateSub, setUpdateSub] = useState(false);

  const [currentType, setCurrentType] = useState("Academic");
  const [tabelData, setTabelData] = useState([]);
  const [tabelData2, setTabelData2] = useState([]);

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
  const handleClose = () => {
    setShow(false);
    setUpdateMain(false);
    setMainTask({
      taskName: "",
      taskType: "Academic",
      completionDate: "",
      diff: "",
      inputData: "",
    });
  };
  const handleShow = () => setShow(true);
  const handleCloseSubTask = () => {
    setShowSubTask(false);
    setUpdateSub(false);
    setMainTask({
      taskName: "",
      taskType: "Academic",
      completionDate: "",
      diff: "",
      inputData: "",
    });
    setSubTask({
      name: "",
      status: false,
      status2: false,
      isDeleted: false,
      // inputData: "",
      completionDate: "",
      diff: "",
    });
  };
  const handleShowSubTask = (task) => {
    setShowSubTask(true);
    setTaskId(task._id);
  };
  const getData = async () => {
    if (userReducer?.currentUser) {
      let res = await dispatch(getAllUserTasks(userReducer?.currentUser?._id));
      setTabelData(res.payload.filter((t) => t.taskType === currentType));
      setTabelData2(res.payload);
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
      errorMessage("Please add goal completion date");
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
      console.log("responsedata===", res.payload.subTask._id);
      let array = [...tabelData];
      let mainIndex = array.findIndex((m) => m._id === res.payload.subTask._id);
      array[mainIndex] = res.payload.subTask;
      setTabelData(array);

      setSubTask({
        name: "",
        status: false,
        status2: false,
        isDeleted: false,
        // inputData: "",
        completionDate: "",
        diff: "",
      });
      // getData();
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
        // if (type === "deleteMainTask") {
        //   successMessage("Goal updated successfully");
        // }
        let array = [...tabelData];
        array = array.filter((t) => t._id != task._id);
        // console.log("array===", array);
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
  const showMaintask = (data) => {
    setUpdateMain(true);
    setShow(true);
    setMainTask(data);
  };
  const updateMaintask = async () => {
    if (mainTask.taskName === "") {
      errorMessage("Plesae add goal name");
      return;
    }
    if (mainTask.taskType === "") {
      errorMessage("Plesae add goal type");
      return;
    }
    if (mainTask.completionDate === "") {
      errorMessage("Please add goal completion date");
      return;
    }

    let array = [...tabelData];
    let index = array.findIndex((t) => t._id === mainTask._id);
    let indexData = { ...array[index] };
    indexData = {
      ...mainTask,
      completionDate: moment(mainTask.completionDate)
        .add(1, "day")
        .format("YYYY-MM-DD"),
      taskType: mainTask.taskType,
      taskName: mainTask.taskName,
    };
    array[index] = indexData;
    setTabelData(array);

    // let res = await dispatch(deleteTask(task._id));
    let res = await dispatch(
      updateTask({
        id: mainTask._id,
        change: { ...mainTask, type: "updateMainTask", type2: "mainTask" },
      })
    );
    if (res.payload) {
      setMainTask({
        taskName: "",
        taskType: "Academic",
        completionDate: "",
        diff: "",
        inputData: "",
      });
      handleClose();
    }
  };
  const delSubTask = async (task, subtask, type) => {
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
        // if (type === "deleteSubTask") {
        //   successMessage("Deleted with time");
        // }
        let array = [...tabelData];
        let indexData = { ...task };
        let cloneSubTasks = [...task.subTasks];
        let mainIndex = array.findIndex((m) => m._id === task._id);
        let subIndex = cloneSubTasks.findIndex((sm) => sm._id === subtask._id);
        // console.log("comsat lahore===222", mainIndex, subIndex);
        cloneSubTasks[subIndex] = {
          ...subtask,
          isDeleted: true,
        };
        indexData.subTasks = cloneSubTasks;
        array[mainIndex] = indexData;
        // console.log("comsat lahore===", indexData);
        setTabelData(array);
        // let res = await dispatch(
        //   updateTask({
        //     id: task._id,
        //     change: { subTasks: cloneSubTasks, type },
        //   })
        // );
        let res = await dispatch(
          deleteSubTask({
            id1: task._id,
            id2: subtask._id,
          })
        );

        // if (res.payload) {
        //   // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
        //   getData();
        // }
      }
    });
  };
  const showSubtask = (data, item) => {
    setUpdateSub(true);
    setShowSubTask(true);
    setSubTask(item);
    setMainTask(data);
  };
  const updateSubtask = async () => {
    if (subTask.name === "") {
      errorMessage("Plesae sub-goal name");
      return;
    }
    if (subTask.completionDate === "") {
      errorMessage("Plesae select sub-goal completion Date");
      return;
    }
    let array = [...tabelData];
    let indexData = { ...mainTask };

    let cloneSubTasks = [...mainTask.subTasks];
    let mainIndex = array.findIndex((m) => m._id === mainTask._id);
    let subIndex = cloneSubTasks.findIndex((sm) => sm._id === subTask._id);

    cloneSubTasks[subIndex] = {
      ...subTask,
      name: subTask.name,
      completionDate: new Date(
        moment(subTask.completionDate).add(1, "day").format("YYYY-MM-DD")
      ),
    };

    indexData.subTasks = cloneSubTasks;

    array[mainIndex] = indexData;
    setTabelData(array);

    let res = await dispatch(
      updateTask({
        id: mainTask._id,
        change: {
          ...mainTask,
          subTasks: cloneSubTasks,
          type: "updateSubTask",
          type2: "subTask",
          updatedSubTask: cloneSubTasks.filter((sm) => sm._id === subTask._id),
        },
      })
    );
    if (res.payload) {
      setSubTask({
        name: "",
        status: false,
        status2: false,
        isDeleted: false,
        // inputData: "",
        completionDate: "",
        diff: "",
      });
      handleCloseSubTask();
    }
  };

  const changeSubTaskStatus = async (task, subtask) => {
    let array = [...tabelData];
    let indexData = { ...task };

    let cloneSubTasks = [...task.subTasks];
    let mainIndex = array.findIndex((m) => m._id === task._id);
    let subIndex = cloneSubTasks.findIndex((sm) => sm._id === subtask._id);

    cloneSubTasks[subIndex] = {
      ...subtask,
      status: !subtask.status,
    };

    indexData.subTasks = cloneSubTasks;

    array[mainIndex] = indexData;
    setTabelData(array);

    if (!subtask.status === true) {
      let res = await dispatch(
        updateSubTask({
          id1: task._id,
          id2: subtask._id,
          status: !subtask.status,
          status2: subtask.status2,
          type: "checkSubTaskStatus1",
          type2: "subTask",
        })
      );
      successMessage("Goal updated successfully");
    }
    if (!subtask.status === false) {
      let res = await dispatch(
        updateSubTask({
          id1: task._id,
          id2: subtask._id,
          status: !subtask.status,
          status2: subtask.status2,
          type: "unCheckSubTaskStatus1",
          type2: "subTask",
        })
      );
      successMessage("Goal updated successfully");
    }
    // if (res.payload) {
    //   // dispatch(getAllUserTasks(userReducer?.currentUser?._id));
    //   getData();
    // }
  };
  const changeSubTaskStatus2 = async (task, subtask) => {
    let array = [...tabelData];
    let indexData = { ...task };

    let cloneSubTasks = [...task.subTasks];
    let mainIndex = array.findIndex((m) => m._id === task._id);
    let subIndex = cloneSubTasks.findIndex((sm) => sm._id === subtask._id);

    cloneSubTasks[subIndex] = {
      ...subtask,
      status2: !subtask.status2,
    };

    indexData.subTasks = cloneSubTasks;

    array[mainIndex] = indexData;
    setTabelData(array);
    if (!subtask.status2 === true) {
      let res = await dispatch(
        updateSubTask({
          id1: task._id,
          id2: subtask._id,
          status: subtask.status,
          status2: !subtask.status2,
          type: "checkSubTaskStatus2",
          type2: "subTask",
        })
      );
      successMessage("Goal updated successfully");
    }
    if (!subtask.status2 === false) {
      let res = await dispatch(
        updateSubTask({
          id1: task._id,
          id2: subtask._id,
          status: subtask.status,
          status2: !subtask.status2,
          type: "unCheckSubTaskStatus2",
          type2: "subTask",
        })
      );
      successMessage("Goal updated successfully");
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
        change: {
          status: task.status,
          status2: task.status2,
          inputData: e.target.value,
          flag: false,
        },
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

    // console.log("daysDifference", days, duration.asDays());
    if (data.status) {
      return 100;
    } else if (days != 0) {
      let value = ((data.diff - days) / data.diff) * 100;
      // console.log("value==", value);
      return value;
    } else {
      return 100;
    }
  };

  const handelChecked = async (task) => {
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
    // console.log("type", status);
    if (status === true) {
      let res = await dispatch(
        updateTask({
          id: task._id,
          change: {
            status,
            status2,
            flag: true,
            type: "checkMainStatus1",
            type2: "mainTask",
          },
        })
      );

      successMessage("Goal updated successfully");
    }
    if (status === false) {
      successMessage("Goal updated successfully");
      let res = await dispatch(
        updateTask({
          id: task._id,
          change: {
            status,
            status2,
            flag: true,
            type: "unCheckMainStatus1",
            type2: "mainTask",
          },
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
          change: {
            status,
            status2,
            flag: false,
            type: "checkMainStatus2",
            type2: "mainTask",
          },
        })
      );
      successMessage("Goal updated successfully");
    }
    if (status2 === false) {
      let res = await dispatch(
        updateTask({
          id: task._id,
          change: {
            status,
            status2,
            flag: false,
            type: "unCheckMainStatus2",
            type2: "mainTask",
          },
        })
      );
      successMessage("Goal updated successfully");
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

  const setFilterData = async (type) => {
    setCurrentType(type);
    // console.log("type=", type);
    let res = await dispatch(getAllUserTasks(userReducer?.currentUser?._id));
    let currentData = res.payload.filter((t) => t.taskType === type);
    // console.log("currentData", currentData);
    setTabelData(currentData);
  };

  return (
    <div>
      <div className="version_onemainDiv" style={{ position: "relative" }}>
        <Header
          array={array}
          buttons={buttons}
          // setCurrentType={setCurrentType}
          setCurrentType={setFilterData}
          currentType={currentType}
          displayButtons={true}
        />

        {/* modal */}
        <Modal show={show} onHide={handleClose} animation={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>{updateManin ? "Edit Goal" : "Add Goal"}</Modal.Title>
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
                defaultValue={mainTask.taskType}
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
                value={moment(mainTask?.completionDate).format("YYYY-MM-DD")}
                onChange={(e) => handelChangeMainTaskDate(e)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {updateManin ? (
              <Button variant="primary" onClick={() => updateMaintask()}>
                Edit Goal
              </Button>
            ) : (
              <Button variant="primary" onClick={() => addMainTask()}>
                Add Goal
              </Button>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={showSubTask}
          onHide={handleCloseSubTask}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {updateSub ? "Edit Sub Goal" : "Add Sub Goal"}
            </Modal.Title>
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
                value={moment(subTask.completionDate).format("YYYY-MM-DD")}
                onChange={(e) => handelChangeSubTaskDate(e)}
              />
            </div>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>

            {updateSub ? (
              <Button variant="primary" onClick={() => updateSubtask()}>
                Edit Sub Goal
              </Button>
            ) : (
              <Button variant="primary" onClick={() => addSubTask2()}>
                Add Sub Goal
              </Button>
            )}
          </Modal.Footer>
        </Modal>
        {/* 1stcheck */}
        {/* {taskReducer?.allUserTaskList */}
        {/* {taskReducer.allUserTaskList */}
        {tabelData
          // ?.filter((t) => t.taskType === currentType)
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
                        <Dropdown.Item onClick={() => showMaintask(data)}>
                          Edit goal
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
                      {!item.isDeleted && (
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
                                      Use this checkbox to indicate that the
                                      goal progress is satisfactory. The goal is
                                      not 100% complete but, the progress is
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
                                    delSubTask(data, item, "deleteSubTask")
                                  }
                                >
                                  Delete Sub Goal
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  onClick={() => showSubtask(data, item)}
                                >
                                  Edit sub goal
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
                      )}
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
