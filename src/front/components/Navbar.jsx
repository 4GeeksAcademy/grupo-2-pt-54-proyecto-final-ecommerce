import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const [categories, setCategories] = useState([])	
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

	console.log(categories)

	useEffect(() => { getCategories() },
		[])

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				<a className="navbar-brand" href="#">
					Navbar
				</a>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<a className="nav-link active" aria-current="page" href="#">
								Home
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="#">
								Link
							</a>
						</li>
						<li className="nav-item dropdown">
							<a
								className="nav-link dropdown-toggle"
								href="#"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								Categories
							</a>
							<ul className="dropdown-menu">
								{categories.map((category) => (
									<li key={category.id}>
									<Link className="dropdown-item" to={`/products/${category.id}`}>
										{category.name}
									</Link>
								</li>))}
							</ul>
						</li>
						<li className="nav-item">
							<a className="nav-link disabled" aria-disabled="true">
								Disabled
							</a>
						</li>
					</ul>
					<form className="d-flex" role="search">
						<input
							className="form-control me-2"
							type="search"
							placeholder="Search"
							aria-label="Search"
						/>
						<button className="btn btn-outline-success" type="submit">
							Search
						</button>
					</form>
				</div>
			</div>
		</nav>

	);
};