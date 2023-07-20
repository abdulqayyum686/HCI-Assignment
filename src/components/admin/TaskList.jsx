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
import Swal from "sweetalert2";

var itemsPerPage = 30;
const TaskList = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector((s) => s.userReducer);
  const taskReducer = useSelector((s) => s.taskReducer);
  const [tasks, setTasks] = useState([]);
  const [tabelData, setTabelData] = useState([]);
  const [show, setShow] = useState(false);

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
  ];

  const handleClose = () => setShow(false);

  const handleShow = (data) => {
    console.log("data===", data);
    setTabelData(data);
    setShow(true);
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
        let res = await dispatch(deleteTask(task._id));
        if (res.payload) {
          getData();
        }
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

  const respectiveType = (type) => {};
  const [currentType, setCurrentType] = useState("Today");
  return (
    <>
      <div>
        <div className="version_onemainDiv">
          <Header
            color={"palevioletred"}
            array={array}
            buttons={[]}
            setCurrentType={respectiveType}
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
                  <th># Sub Tasks</th>
                  <th>Creation Date</th>
                  <th>Completion Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.taskType}</td>
                      <td>{data.version}</td>
                      <td>{data.status ? "Complete" : "InComplete"}</td>
                      <td>{data.status2 ? "Completed" : "InComplete"}</td>
                      <td>{data.belongsTo.email}</td>
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
                      <td className="text-center">
                        <MdDelete
                          onClick={() => deleteMainRow(data)}
                          className="delete_icon"
                        />
                      </td>
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
    </>
  );
};

export default TaskList;
