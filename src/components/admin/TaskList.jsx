import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks, deleteTask, deleteSubTask } from "../../Redux/task";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Header from "../Header/Header";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import Swal from "sweetalert2";
import { errorMessage, successMessage } from "../../utils/message";
import { updateTask } from "../../Redux/task";

var itemsPerPage = 30;
const TaskList = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector((s) => s.userReducer);
  const taskReducer = useSelector((s) => s.taskReducer);

  const [currentType, setCurrentType] = useState("Today");
  const [mainTask, setMainTask] = useState({
    taskName: "",
    taskType: "Academic",
    completionDate: "",
    diff: "",
    inputData: "",
  });

  const [tasks, setTasks] = useState([]);
  const [tabelData, setTabelData] = useState([]);
  const [inputData, setInputData] = useState(null);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  // react pagination
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = tasks.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(tasks.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % tasks.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const getData = async () => {
    if (userReducer?.currentUser) {
      let res = await dispatch(getAllTasks());
      setTasks(res.payload);
    }
  };

  useEffect(() => {
    getData();
  }, [userReducer?.currentUser]);
  const array = [
    {
      name: "User List",
      url: "/admin-users-list",
    },
    {
      name: "Tasks List",
      url: "/admin-task-list",
    },
    {
      name: "User Activity",
      url: "/admin-user-activity",
    },
  ];

  const handleClose = () => setShow(false);

  const handleShow = (data) => {
    console.log("data===", data);
    setTabelData(data);
    setShow(true);
  };
  const handleClose2 = () => setShow2(false);
  const handleShow2 = (data) => {
    console.log("data===2", data);
    setInputData(data);
    setShow2(true);
  };
  const handleClose3 = () => setShow3(false);
  const handleShow3 = (data) => {
    console.log("data===2", data);
    setMainTask(data);
    setShow3(true);
  };

  const deleteMainRow = async (task) => {
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
        let array = [...tasks];
        array = array.filter((t) => t._id != task._id);
        console.log("array===", array);
        setTasks(array);

        let res = await dispatch(deleteTask(task._id));
        // if (res.payload) {
        //   getData();
        // }
      }
    });
  };
  const deleteSubRow = async (task) => {
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
          deleteSubTask({ id1: tabelData._id, id2: task._id })
        );
        if (res.payload) {
          getData();
          handleClose();
        }
      }
    });
  };

  const handelChange = (e) => {
    setMainTask({ ...mainTask, [e.target.name]: e.target.value });
  };

  const updateMainTask = async () => {
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

    let array = [...tasks];
    let index = array.findIndex((t) => t._id === mainTask._id);
    let indexData = { ...array[index] };
    indexData = {
      ...mainTask,
      completionDate: new Date(mainTask.completionDate),
    };
    array[index] = indexData;
    setTasks(array);
    let res = await dispatch(
      updateTask({
        id: mainTask._id,
        change: {
          ...mainTask,
          completionDate: new Date(mainTask.completionDate),
        },
      })
    );
    if (res.payload) {
      successMessage("Goal updated successfully");
      setMainTask({
        taskName: "",
        taskType: "Academic",
        completionDate: "",
        diff: "",
        inputData: "",
      });
    }
    handleClose3();
  };
  const currentDate = new Date().toISOString().split("T")[0];
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
  return (
    <>
      <div>
        <div className="version_onemainDiv">
          <Header
            type={"admin"}
            color={"palevioletred"}
            array={array}
            buttons={[]}
            setCurrentType={setCurrentType}
            currentType={currentType}
            displayButtons={true}
          />
          {/* modal */}
          <div
            className="m-auto mt-5"
            style={{ overflowX: "scroll", width: "90%" }}
          >
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Task Type</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Satisfactory Status</th>
                  <th>Uploaded By</th>
                  <th>Input Data</th>
                  <th># Sub Tasks</th>
                  <th>Creation Date</th>
                  <th>Completion Date</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.taskType}</td>
                      <td>{data.version}</td>
                      <td>{data.status ? "Complete" : "Incomplete"}</td>
                      <td>{data.status2 ? "Complete" : "Incomplete"}</td>
                      <td>{data?.belongsTo?.email}</td>
                      <td>
                        <button
                          className="button_style"
                          onClick={() => handleShow2(data)}
                        >
                          View
                        </button>
                        {/* {data.subTasks.length} */}
                      </td>

                      <td>
                        {data.subTasks.length > 0 ? (
                          <button
                            className="button_style"
                            onClick={() => handleShow(data)}
                          >
                            View
                          </button>
                        ) : (
                          data.subTasks.length
                        )}
                        {/* {data.subTasks.length} */}
                      </td>
                      <td style={{ minWidth: "100px" }}>
                        {moment(data.createdAt).format("YYYY-MM-DD")}
                      </td>
                      <td style={{ minWidth: "100px" }}>
                        {moment(data.completionDate).format("YYYY-MM-DD")}
                      </td>
                      {/* <td className="text-center">
                        <MdDelete
                          onClick={() => deleteMainRow(data)}
                          className="delete_icon"
                        />
                        <BiEdit
                          onClick={() => handleShow3(data)}
                          className="delete_icon ms-2"
                        />
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            activeClassName="active"
            containerClassName="pagination"
            previousLinkClassName="previous"
            nextLinkClassName="next"
          />
        </div>
      </div>
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sub Tasks List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="m-auto mt-5"
            style={{ overflowX: "scroll", width: "90%" }}
          >
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Satisfactory Status</th>
                  <th>Status</th>
                  <th>Creation Date</th>
                  <th>Completion Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tabelData?.subTasks?.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        {data.status2 === true ? "Complete" : "InComplete"}
                      </td>

                      <td>
                        {data.status === true ? "Complete" : "InComplete"}
                      </td>
                      <td style={{ minWidth: "100px" }}>
                        {moment(data.date).format("YYYY-MM-DD")}
                      </td>
                      <td style={{ minWidth: "100px" }}>
                        {moment(data.completionDate).format("YYYY-MM-DD")}
                      </td>
                      <td className="text-center">
                        <MdDelete
                          onClick={() => deleteSubRow(data)}
                          className="delete_icon"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={show2} onHide={handleClose2} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Input Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="m-auto mt-5"
            style={{ overflowX: "scroll", width: "90%" }}
          >
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Input Data</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{inputData?.inputData}</td>
                  <td style={{ minWidth: "100px" }}>
                    {moment(inputData?.updatedAt).format("YYYY-MM-DD")}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={show3} onHide={handleClose3} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Goal</Modal.Title>
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
              value={mainTask.taskType}
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
          <Button variant="secondary" onClick={handleClose3}>
            Close
          </Button>
          <Button variant="primary" onClick={() => updateMainTask()}>
            Update Goal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskList;
