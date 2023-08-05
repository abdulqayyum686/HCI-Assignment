import React, { useEffect, useState } from "react";
import moment from "moment";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import Header from "../Header/Header";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { getAllActivity, deleteSubTask } from "../../../src/Redux/task";
const _ = require("lodash");
var itemsPerPage = 30;

const UserActivity = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector((s) => s.userReducer);
  const taskReducer = useSelector((s) => s.taskReducer);

  const [currentVersion, setCurrentVersion] = useState("1");
  const [inputData, setInputData] = useState(null);
  const [tabelData, setTabelData] = useState([]);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [userActivity, setUserActivity] = useState([]);
  const [userActivity2, setUserActivity2] = useState([]);

  const [currentType, setCurrentType] = useState("Today");
  const respectiveType = (type) => {
    setCurrentType(type);
  };

  // react pagination
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = userActivity.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(userActivity.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % userActivity.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const getData = async () => {
    if (userReducer?.currentUser) {
      // let res = await dispatch(getAllUsers(userReducer?.currentUser?._id));
      let res2 = await dispatch(getAllActivity());
      // let array = _.orderBy(res2.payload, ["_id", "belongsTo.email", "type2"]);
      setUserActivity(res2.payload.filter((t) => t.version === "1"));
      setUserActivity2(res2.payload);
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
    console.log("data===1122", data);
    setTabelData(data);
    setShow(true);
  };
  const handleClose2 = () => setShow2(false);
  const handleShow2 = (data) => {
    console.log("data===2", data);
    setInputData(data);
    setShow2(true);
  };

  // const deleteSubRow = async (task) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       let res = await dispatch(
  //         deleteSubTask({ id1: tabelData._id, id2: task._id })
  //       );
  //       if (res.payload) {
  //         getData();
  //         handleClose();
  //       }
  //     }
  //   });
  // };
  const [buttons, setButtons] = useState([
    { name: "Version1", value: "1" },
    { name: "Version2", value: "2" },
    { name: "Version3", value: "3" },
    { name: "Version4", value: "4" },
  ]);

  const setVersionFilter = (val) => {
    setCurrentVersion(val);
    let array = [...userActivity2];
    let currentData = array.filter((t) => t.version === val);
    // let sort = _.orderBy(currentData, ["_id", "belongsTo.email", "type2"]);
    // // console.log("currentData", currentData);
    // setUserActivity(sort);
    setUserActivity(currentData);
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
          {
            <div className="buttons_taskDiv">
              {buttons.map((itm, index) => {
                return (
                  <button
                    className="button_text"
                    key={index}
                    onClick={() => setVersionFilter(itm.value)}
                    style={{
                      color:
                        currentVersion === itm.value ? "palevioletred" : "",
                    }}
                  >
                    {itm.name}
                  </button>
                );
              })}
            </div>
          }
          <div
            className="m-auto mt-5"
            style={{ overflowX: "scroll", width: "90%" }}
          >
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Task Name</th>
                  <th>Task Type</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Satisfactory Status</th>
                  <th>Is Deleted</th>
                  <th>Uploaded By</th>
                  <th>Input Data</th>
                  <th># Sub Tasks</th>
                  <th>Creation Date</th>
                  <th>Completion Date</th>
                  <th>Timestamps</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {currentItems
                  // ?.filter((t) => t.version === currentVersion)
                  .map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        {/* <td>{data._id}</td>
                        <td>{data.actionType}</td>
                        <td>{data?.belongsTo?.email}</td> */}
                        <td>{data.taskName}</td>
                        <td>{data.taskType}</td>
                        <td>{data.version}</td>
                        <td>{data.status ? "Complete" : "Incomplete"}</td>
                        <td>{data.status2 ? "Complete" : "Incomplete"}</td>
                        <td>{data.isDeleted ? "Deleted" : "Running"}</td>

                        <td>{data?.belongsTo?.email}</td>
                        <td>
                          <button
                            className="button_style"
                            onClick={() => handleShow2(data)}
                          >
                            View
                          </button>
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
                        </td>
                        <td style={{ minWidth: "100px" }}>
                          {moment(data.createdAt).format("YYYY-MM-DD")}
                        </td>
                        <td style={{ minWidth: "100px" }}>
                          {moment(data.completionDate).format("YYYY-MM-DD")}
                        </td>
                        <td style={{ minWidth: "100px" }}>
                          {moment(data.updatedAt).format("YYYY-MM-DD HH:mm")}
                        </td>
                        {/* <td className="text-center">
                        <MdDelete
                          //   onClick={() => deleteMainRow(data)}
                          className="delete_icon"
                        />
                        <BiEdit
                          //   onClick={() => handleShow3(data)}
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
                    <th>Is Deleted</th>
                    <th>Creation Date</th>
                    <th>Completion Date</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                {console.log(tabelData)}
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
                        <td>
                          {data.isDeleted === true ? "Deleted" : "Running"}
                        </td>
                        <td style={{ minWidth: "100px" }}>
                          {moment(data.date).format("YYYY-MM-DD")}
                        </td>
                        <td style={{ minWidth: "100px" }}>
                          {moment(data.completionDate).format("YYYY-MM-DD")}
                        </td>
                        {/* <td className="text-center">
                          <MdDelete
                            onClick={() => deleteSubRow(data)}
                            className="delete_icon"
                          />
                        </td> */}
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
      </div>
    </>
  );
};

export default UserActivity;
