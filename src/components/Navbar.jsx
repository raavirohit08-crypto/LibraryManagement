import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/books" className="brand">
          📚 Library
        </NavLink>

        <div className="nav-links">
          {user ? (
            <>
              <NavLink to="/books" end>
                Books
              </NavLink>
              <NavLink to="/books/new">Add Book</NavLink>
              <NavLink to="/favorites">Favorites</NavLink>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
