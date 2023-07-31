import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../../Redux/user";
import { getAllTasks } from "../../Redux/task";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Header from "../Header/Header";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { MdDelete } from "react-icons/md";
var itemsPerPage = 30;
const Users = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector((s) => s.userReducer);
  const taskReducer = useSelector((s) => s.taskReducer);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [show, setShow] = useState(false);
  const [loginCount, setLoginCount] = useState(null);

  // react pagination
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = users.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(users.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % users.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const getData = async () => {
    if (userReducer?.currentUser) {
      let res = await dispatch(getAllUsers(userReducer?.currentUser?._id));
      let res2 = await dispatch(getAllTasks());
      setTasks(res2.payload);
      setUsers(res.payload);
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
  const [buttons, setButtons] = useState();
  const [currentType, setCurrentType] = useState("Today");
  const respectiveType = (type) => {
    setCurrentType(type);
  };

  const deleteRow = async (task) => {
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
        let res = await dispatch(deleteUser(task._id));
        if (res.payload) {
          getData();
        }
      }
    });
  };

  const handleClose = () => setShow(false);
  const handleShow = (data) => {
    console.log("data===", data);
    setLoginCount(data);
    setShow(true);
  };
  const returnTaskCount = (data, flag) => {
    let count = tasks?.filter(
      (t) => t?.belongsTo._id === data?._id && t.status === flag
    )?.length;
    // console.log("count===", count);
    return count;
  };
  const returnSubTaskCount = (data, flag) => {
    let count = tasks
      .filter((task) => task.belongsTo._id === data._id)
      ?.flatMap((task) =>
        task.subTasks.filter((subTask) => subTask.status === flag)
      )?.length;
    console.log("count===", count);
    return count;
  };

  return (
    <>
      <div>
        <div className="version_onemainDiv">
          <Header
            type={"admin"}
            color={"palevioletred"}
            array={array}
            buttons={buttons}
            setCurrentType={respectiveType}
            currentType={currentType}
            displayButtons={false}
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
                  <th>Email</th>
                  <th>Version</th>
                  <th>Login Count</th>
                  <th># Tasks</th>
                  <th># Remaning tasks</th>
                  <th># sub-tasks completed</th>
                  <th># Remaning sub-tasks</th>
                  <th>Creation Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.email}</td>
                      <td>{data.version}</td>
                      <td>
                        <button
                          className="button_style"
                          onClick={() => handleShow(data)}
                        >
                          View
                        </button>

                        {/* {data.subTasks.length} */}
                      </td>
                      <td>{returnTaskCount(data, false)}</td>
                      <td>{returnTaskCount(data, true)}</td>
                      <td>{returnSubTaskCount(data, false)}</td>
                      <td>{returnSubTaskCount(data, true)}</td>

                      <td>{moment(data.createdAt).format("YYYY-MM-DD")}</td>
                      <td className="text-center">
                        <MdDelete
                          onClick={() => deleteRow(data)}
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

          <Modal show={show} onHide={handleClose} animation={false} centered>
            <Modal.Header closeButton>
              <Modal.Title>Login Count</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                className="m-auto mt-5"
                style={{ overflowX: "scroll", width: "90%" }}
              >
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Login Count </th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{loginCount?.loginCount}</td>

                      <td style={{ minWidth: "100px" }}>
                        {moment(loginCount?.updatedAt).format("YYYY-MM-DD")}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Users;
