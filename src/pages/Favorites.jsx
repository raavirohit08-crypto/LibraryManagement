import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";

function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]); // each has .book (via _expand)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getFavorites() {
      try {
        const res = await api.get("/favorites", {
          params: { userId: user.id, _expand: "book" },
        });
        setFavorites(res.data.filter((f) => f.book));
      } catch (err) {
        console.log(err);
        setError("Could not load favorites");
      } finally {
        setLoading(false);
      }
    }
    getFavorites();
  }, [user.id]);

  async function removeFavorite(book) {
    const fav = favorites.find((f) => f.bookId === book.id);
    if (!fav) return;

    try {
      await api.delete(`/favorites/${fav.id}`);
      setFavorites(favorites.filter((f) => f.id !== fav.id));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h1>My Favorite Books</h1>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading...</p>}

      {!loading && !error && favorites.length === 0 && (
        <p className="muted">
          You have no favorite books yet. Tap the ♡ on any book to add it.
        </p>
      )}

      <div className="grid">
        {favorites.map((f) => (
          <BookCard
            key={f.id}
            book={f.book}
            isFavorite={true}
            onToggleFavorite={removeFavorite}
          />
        ))}
      </div>
    </>
  );
}

export default Favorites;
