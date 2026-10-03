import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { PLACEHOLDER_IMAGE } from "../constants";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getBook() {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        setError("Book not found");
      }
    }
    getBook();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!book) return <p className="muted">Loading...</p>;

  return (
    <div className="details">
      <img
        src={book.image || PLACEHOLDER_IMAGE}
        alt={book.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_IMAGE;
        }}
      />

      <div>
        <h1>{book.title}</h1>
        <p className="muted">by {book.author}</p>

        <div className="badges">
          <span className="badge">{book.category}</span>
          <span className={`badge ${book.available ? "ok" : "no"}`}>
            {book.available ? "Available" : "Issued"}
          </span>
          {book.year && <span className="badge">{book.year}</span>}
        </div>

        <p>{book.description || "No description available."}</p>

        <div className="row">
          <Link className="btn" to={`/books/${book.id}/edit`}>
            Edit
          </Link>
          <Link className="btn btn-outline" to="/books">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
