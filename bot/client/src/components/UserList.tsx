import { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { CgUnblock } from "react-icons/cg";

export type User = {
  name: string;
  id: string;
  city: string;
  isBlocked: boolean;
};

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  function deleteUser(user: User) {
    axios
      .post("/api/deleteUser", {
        id: user.id,
      })
      .then((res) => {
        console.log(res);
        if (res.data == true) {
          alert("User deleted Successfully");
          fetchAllUsers();
        } else {
          alert("Failed to Delete User !");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function blockUser(user: User) {
    axios
      .post("/api/blockUser", {
        id: user.id,
      })
      .then((res) => {
        console.log(res);
        if (res.data == true) {
          alert("User Blocked Successfully");
          fetchAllUsers();
        } else {
          alert("Failed to Block User !");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function unblockUser(user: User) {
    axios
      .post("/api/unblockUser", {
        id: user.id,
      })
      .then((res) => {
        console.log(res);
        if (res.data == true) {
          alert("User Unblocked Successfully");
          fetchAllUsers();
        } else {
          alert("Failed to Unblock User !");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const fetchAllUsers = () => {
    axios.get("/api/users").then((resp) => {
      setUsers(resp.data);
    });
  };

  return (
    <div style={{"width":"100%"}}>
      <h1>User List</h1>
      <Table borderless hover variant="dark">
        <thead>
          <tr className="text-center">
            <th className="text-center">ID</th>
            <th>First Name</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="text-center">
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.city}</td>
              <td className="d-flex justify-content-evenly">
                <Tooltip title="Delete User">
                  <IconButton color="primary" onClick={(_) => deleteUser(user)}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                </Tooltip>

                {user.isBlocked != true ? (
                  <>
                    <Tooltip title="Block User">
                      <IconButton
                        color="warning"
                        onClick={(_) => blockUser(user)}
                      >
                        <BlockIcon color="warning" />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Unblock User">
                      <IconButton
                        color="success"
                        onClick={(_) => unblockUser(user)}
                      >
                        <CgUnblock color="success" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
