import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { CATEGORIES } from "../constants";

const emptyBook = {
  title: "",
  author: "",
  category: CATEGORIES[0],
  year: "",
  available: true,
  image: "",
  description: "",
};

// Used for both "Add Book" (no id) and "Edit Book" (id in URL)
function BookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyBook);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    async function getBook() {
      try {
        const res = await api.get(`/books/${id}`);
        setForm({ ...emptyBook, ...res.data });
      } catch (err) {
        setError("Book not found");
      }
    }
    getBook();
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      year: form.year ? Number(form.year) : "",
    };

    try {
      setSaving(true);
      if (isEdit) {
        await api.put(`/books/${id}`, payload);
      } else {
        await api.post("/books", payload);
      }
      navigate("/books");
    } catch (err) {
      console.log(err);
      setError("Could not save the book");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-box">
      <h1>{isEdit ? "Edit Book" : "Add Book"}</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title *</label>
        <input name="title" value={form.title} onChange={handleChange} />

        <label>Author *</label>
        <input name="author" value={form.author} onChange={handleChange} />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Published Year</label>
        <input
          type="number"
          name="year"
          value={form.year}
          onChange={handleChange}
        />

        <label>Cover Image URL</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
        />

        <label>Description</label>
        <textarea
          name="description"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />

        <label className="checkbox">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          />
          Available in library
        </label>

        <div className="row">
          <button className="btn" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Book" : "Add Book"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/books")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;
