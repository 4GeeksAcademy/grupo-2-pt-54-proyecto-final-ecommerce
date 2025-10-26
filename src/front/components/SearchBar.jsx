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
        <form
            className="position-relative w-100"
            role="search"
            onSubmit={handleSearch}
        >
            <input
                className="form-control border-0 shadow-sm"
                type="text"
                placeholder="Buscar producto..."
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "50px",
                    padding: "0.6rem 3rem 0.6rem 1rem",
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease-in-out",
                    outline: "none",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #19875450")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
            <span
                className="position-absolute top-50 end-0 translate-middle-y me-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#198754",
                    color: "white",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                }}
                onClick={handleIconClick}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#157347")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#198754")}
            >
                <i className="fa-solid fa-magnifying-glass"></i>
            </span>
        </form>
    );

}

export default SearchBar;