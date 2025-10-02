import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import SearchBar from "../components/SearchBar.jsx";

export const Home = () => {
	const [searchResults, setSearchResults] = useState([]);
	//aqui hago un llamado a la API para obtener los productos

	const handleSearch = async (query = "") => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search/products/${encodeURIComponent(query)}`);
			if (!response.ok) {
				throw new Error("Error al obtener los productos");
			}
			const data = await response.json();
			setSearchResults(data.products);
		} catch (err) {
			console.error(err);
			setSearchResults([]);
		}
	};

	useEffect(() => {
	}, []);

	return (
		<div>
			<SearchBar onSearch={handleSearch} />
			<h1>Resultados de la búsqueda:</h1>
			{
				searchResults.length == 0 ? (
					<h1>No hay resultados</h1>
				) : (
					<ul>
						{searchResults.map(product => (
							<li key={product.id}>
								<h2>{product.name}</h2>
								<img src={product.image} alt={product.name} />
								<p>{product.description}</p>
								<p>Precio: ${product.price}</p>
							</li>
						))}
					</ul>
				)
			}
		</div>
	)
};
