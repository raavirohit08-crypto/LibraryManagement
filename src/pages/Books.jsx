import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";
import SearchFilter from "../components/SearchFilter";

function Books() {
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]); // [{id, userId, bookId}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");

  // Load this user's favorites once
  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await api.get("/favorites", {
          params: { userId: user.id },
        });
        setFavorites(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    loadFavorites();
  }, [user.id]);

  // Search + filter (debounced) handled by JSON Server
  useEffect(() => {
    const timer = setTimeout(getBooks, 300);
    return () => clearTimeout(timer);
  }, [search, category, availability]);

  async function getBooks() {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (search.trim()) params.q = search.trim();
      if (category) params.category = category;
      if (availability) params.available = availability;

      const res = await api.get("/books", { params });
      setBooks(res.data);
    } catch (err) {
      console.log(err);
      setError("Could not load books. Is JSON Server running on port 3000?");
    } finally {
      setLoading(false);
    }
  }

  function findFavorite(bookId) {
    return favorites.find((f) => f.bookId === bookId);
  }

  async function toggleFavorite(book) {
    try {
      const existing = findFavorite(book.id);

      if (existing) {
        await api.delete(`/favorites/${existing.id}`);
        setFavorites(favorites.filter((f) => f.id !== existing.id));
      } else {
        const res = await api.post("/favorites", {
          userId: user.id,
          bookId: book.id,
        });
        setFavorites([...favorites, res.data]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteBook(book) {
    if (!window.confirm(`Delete "${book.title}"?`)) return;

    try {
      await api.delete(`/books/${book.id}`);

      // remove favorites that point to this book (all users)
      const favRes = await api.get("/favorites", {
        params: { bookId: book.id },
      });
      await Promise.all(
        favRes.data.map((f) => api.delete(`/favorites/${f.id}`))
      );

      setBooks(books.filter((b) => b.id !== book.id));
      setFavorites(favorites.filter((f) => f.bookId !== book.id));
    } catch (err) {
      console.log(err);
      alert("Could not delete the book");
    }
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setAvailability("");
  }

  return (
    <>
      <h1>All Books</h1>

      <SearchFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        availability={availability}
        setAvailability={setAvailability}
        onClear={clearFilters}
      />

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading...</p>}

      {!loading && !error && books.length === 0 && (
        <p className="muted">No books found.</p>
      )}

      <div className="grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorite={Boolean(findFavorite(book.id))}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteBook}
          />
        ))}
      </div>
    </>
  );
}

export default Books;
