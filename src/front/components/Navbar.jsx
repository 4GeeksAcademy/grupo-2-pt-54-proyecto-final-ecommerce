import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import SearchBar from "./SearchBar.jsx";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const cartQty = store.cart?.reduce((s, it) => s + (it.qty || 0), 0) || 0;
	const [categories, setCategories] = useState([])
	const isAuthenticated = sessionStorage.getItem("access_token");

	const navigate = useNavigate();
	const getCategories = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
			if (!response.ok) {
				throw new Error("Error al obtener las categorias");

			}
			const body = await response.json()

			console.log(body)

			setCategories(body.categories)

		} catch (err) {
			console.error(err)
		}
	}
	const handleSearch = async (query = "") => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search/products/${encodeURIComponent(query)}`);
			if (!response.ok) {
				throw new Error("Error al obtener los productos");
			}
			const data = await response.json();
			dispatch({ type: "set_search_results", payload: { products: data.products } });
			navigate("/search-results");
		} catch (err) {
			console.error(err);
		}
	};
	const handleLogout = ()=>{
		sessionStorage.removeItem('access_token');
		navigate("/")
	}

	console.log(categories)

	useEffect(() => { getCategories() },
		[])

	return (
		<nav className="navbar navbar-dark bg-dark">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1 text-success">
						<i className="fa-solid fa-store me-2"></i>ShopNow
					</span>
				</Link>
				<div className="btn-group me-auto ms-3">
					<button type="button" className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
						Categories
					</button>
					<ul className="dropdown-menu">
						{categories.map((category) => (
							<li key={category.id}>
								<Link className="dropdown-item" to={`/products/${category.id}`}>
									{category.name}
								</Link>
							</li>))}
					</ul>
				</div>
				{/* AQUI PUEDE IR LA SEARCHBAR */}

				<SearchBar onSearch={handleSearch} />


				<div className="ms-auto d-flex gap-2">
					<button
						className="btn btn-success"
						onClick={() => dispatch({ type: "open_cart" })}
					>
						<i className="fa-solid fa-cart-shopping me-2"></i>{cartQty}
					</button>
					{isAuthenticated ? 
						<button type="button" class="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
						:
						<Link to="/login">
							<button type="button" class="btn btn-outline-primary">Login / Sign Up</button>
						</Link>}
				</div>
			</div>
		</nav>
	)
};