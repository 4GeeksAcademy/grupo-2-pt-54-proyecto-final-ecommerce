import { useEffect, useState } from "react";


function SearchBar({onSearch}) {

        const [query, setQuery] = useState("");
        const handleSearch = (e) => {
            e.preventDefault();
            onSearch(query);
        }
            return (
                <form className="d-flex" role="search" onSubmit={handleSearch}>
                    <input
                        className="form-control me-2"
                        type="text"
                        placeholder="Search"
                        aria-label="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            )
    }

export default SearchBar;