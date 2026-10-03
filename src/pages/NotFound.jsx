import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="center">
      <h1>404</h1>
      <p className="muted">Page not found.</p>
      <Link className="btn" to="/books">
        Go to Books
      </Link>
    </div>
  );
}

export default NotFound;
