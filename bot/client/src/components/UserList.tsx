import { useState, useEffect } from "react";
import axios from "axios";

export type User = {
  name: string,
  id: string,
  city: string
}

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get("/api/users").then((resp) => {
      setUsers(resp.data);
    });
  }, []);
  return (
    <div>
      <div>User List :</div>
      {users.map(user => (
        <div className="user">{user.name}</div>
      ))}
    </div>
  );
};
