import { useEffect, useState } from "react";


function SearchBar({ onSearch }) {

    const [query, setQuery] = useState("");
    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
    }
    const handleIconClick = () => {
        onSearch(query);
    };
    return (
        <form className="position-relative w-50" role="search" onSubmit={handleSearch}>
            <input
                className="form-control pe-5"
                type="text"
                placeholder="Buscar producto..."
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingRight: "2.5rem" }}
            />
            <span
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ cursor: "pointer", zIndex: 2 }}
                onClick={handleIconClick}
            >
                <i className="fa fa-search text-secondary"></i>
            </span>
        </form>
    );
}

export default SearchBar;