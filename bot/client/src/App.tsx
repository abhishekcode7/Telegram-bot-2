import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { UserList } from "./components/UserList";

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <>
      {isAuthenticated == true ? (
        <UserList />
      ) : (
        <button onClick={() => loginWithRedirect()}>Log in</button>
      )}
    </>
  );
}

export default App;
