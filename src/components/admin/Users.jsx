import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../../Redux/user";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Header from "../Header/Header";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
var itemsPerPage = 30;
const Users = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector((s) => s.userReducer);
  const taskReducer = useSelector((s) => s.taskReducer);
  const [users, setUsers] = useState([]);

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
  return (
    <>
      <div>
        <div className="version_onemainDiv">
          <Header
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
        </div>
      </div>
    </>
  );
};

export default Users;
