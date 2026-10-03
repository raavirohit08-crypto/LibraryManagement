import { Link } from "react-router-dom";
import { PLACEHOLDER_IMAGE } from "../constants";

function BookCard({ book, isFavorite, onToggleFavorite, onDelete }) {
  return (
    <div className="card">
      <button
        className={`fav-btn ${isFavorite ? "active" : ""}`}
        onClick={() => onToggleFavorite(book)}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      <img
        src={book.image || PLACEHOLDER_IMAGE}
        alt={book.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_IMAGE;
        }}
      />

      <div className="card-body">
        <h3>{book.title}</h3>
        <p className="muted">by {book.author}</p>

        <div className="badges">
          <span className="badge">{book.category}</span>
          <span className={`badge ${book.available ? "ok" : "no"}`}>
            {book.available ? "Available" : "Issued"}
          </span>
        </div>

        <div className="card-actions">
          <Link className="btn btn-sm" to={`/books/${book.id}`}>
            View
          </Link>
          <Link className="btn btn-outline btn-sm" to={`/books/${book.id}/edit`}>
            Edit
          </Link>
          {onDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(book)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
