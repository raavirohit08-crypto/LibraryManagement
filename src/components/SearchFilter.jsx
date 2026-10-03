import { CATEGORIES } from "../constants";

function SearchFilter({
  search,
  setSearch,
  category,
  setCategory,
  availability,
  setAvailability,
  onClear,
}) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="true">Available</option>
        <option value="false">Issued</option>
      </select>

      <button className="btn btn-outline" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}

export default SearchFilter;
