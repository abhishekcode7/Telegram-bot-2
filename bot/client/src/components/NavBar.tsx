import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";
const NavBar = () => {
  const { logout, user, isAuthenticated } = useAuth0();

  return (
    <Navbar fixed="top" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="">Telegram Bot Admin Panel</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user?.name != null ? (
            <Navbar.Text>Signed in as: {user.name}</Navbar.Text>
          ) : (
            ""
          )}

          {isAuthenticated && (
            <Button
              className="ml-1"
              variant="dark"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log Out
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
