import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { UserList } from "./components/UserList";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import Spinner from "react-bootstrap/Spinner";
// import BotSettings from "./components/BotSettings";

function App() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  return (
    <>
      <NavBar />
      {isLoading == true && isAuthenticated == false && (
        <Spinner animation="border" />
      )}
      {isLoading == false && isAuthenticated == true && (
        <>
          {/* <BotSettings /> */}
          <UserList />
        </>
      )}
      {isLoading == false && isAuthenticated == false && (
        <button onClick={() => loginWithRedirect()}>Log in</button>
      )}
    </>
  );
}

export default App;
