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
import { getAllActivity } from "../../../src/Redux/task";
var itemsPerPage = 30;

const UserActivity = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector((s) => s.userReducer);
  const taskReducer = useSelector((s) => s.taskReducer);

  const [userActivity, setUserActivity] = useState([]);

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
      setUserActivity(res2.payload);
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
  //   const handleClose = () => setShow(false);

  //   const handleShow = (data) => {
  //     console.log("data===", data);
  //     setTabelData(data);
  //     setShow(true);
  //   };
  //   const handleClose2 = () => setShow2(false);
  //   const handleShow2 = (data) => {
  //     console.log("data===2", data);
  //     setInputData(data);
  //     setShow2(true);
  //   };
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
                  {/* <th>Uploaded By</th> */}
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
                      {/* <td>{data?.belongsTo?.email}</td> */}
                      <td>
                        <button
                          className="button_style"
                          //   onClick={() => handleShow2(data)}
                        >
                          View
                        </button>
                      </td>

                      <td>
                        {data.subTasks.length > 0 ? (
                          <button
                            className="button_style"
                            // onClick={() => handleShow(data)}
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
      </div>
    </>
  );
};

export default UserActivity;
