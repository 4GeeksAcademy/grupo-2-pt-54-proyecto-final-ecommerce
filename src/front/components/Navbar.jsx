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
	const handleLogout = () => {
		sessionStorage.removeItem('access_token');
		navigate("/")
	}

	console.log(categories)

	useEffect(() => { getCategories() },
		[])

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm border-bottom border-success sticky-top">
			<div className="container px-4">
				<Link to="/" className="navbar-brand d-flex align-items-center text-success fw-bold">
					<i className="fa-solid fa-store me-2"></i>ShopNow
				</Link>

				<button
					className="navbar-toggler border-0"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#mainNavbar"
					aria-controls="mainNavbar"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse justify-content-center" id="mainNavbar">
					<div className="d-flex align-items-center flex-grow-1 mx-4" style={{ maxWidth: "900px" }}>
						<div
							className="d-flex align-items-center bg-light rounded-pill border border-success flex-grow-1 position-relative"
							style={{ height: "44px", overflow: "visible" }}
						>
							<div className="dropdown position-static">
								<button
									type="button"
									className="btn btn-light text-dark dropdown-toggle border-0 rounded-start px-3"
									data-bs-toggle="dropdown"
									aria-expanded="false"
									style={{ height: "44px", fontSize: "0.9rem" }}
								>
									<i className="fa-solid fa-layer-group me-2 text-success"></i>Categorías
								</button>
								<ul className="dropdown-menu dropdown-menu-dark shadow mt-2" style={{ zIndex: 1080 }}>
									{categories.map((category) => (
										<li key={category.id}>
											<Link
												className="dropdown-item d-flex align-items-center"
												to={`/products/${category.id}`}
											>
												<i className="fa-regular fa-folder-open me-2 text-success"></i>
												{category.name}
											</Link>
										</li>
									))}
								</ul>
							</div>

							<div className="flex-grow-1 px-2">
								<SearchBar onSearch={handleSearch} />
							</div>
						</div>
					</div>

					<div className="d-flex align-items-center gap-3">
						<button
							className="btn btn-success rounded-pill position-relative px-3"
							onClick={() => dispatch({ type: "open_cart" })}
						>
							<i className="fa-solid fa-cart-shopping"></i>
							<span
								className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-light text-success border"
								style={{ fontSize: "0.65rem" }}
							>
								{cartQty}
							</span>
						</button>

						{isAuthenticated ? (
							<button
								type="button"
								className="btn btn-outline-success rounded-pill px-3"
								onClick={handleLogout}
							>
								<i className="fa-solid fa-right-from-bracket me-1"></i>Logout
							</button>
						) : (
							<Link to="/login">
								<button
									type="button"
									className="btn btn-outline-success rounded-pill px-3 text-white border-success"
								>
									<i className="fa-solid fa-user me-1 text-success"></i>Login / Sign Up
								</button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);


};