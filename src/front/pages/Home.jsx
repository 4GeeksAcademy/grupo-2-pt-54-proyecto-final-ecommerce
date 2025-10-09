import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import SearchBar from "../components/SearchBar.jsx";

export const Home = () => {
	const [searchResults, setSearchResults] = useState([]);
	//aqui hago un llamado a la API para obtener los productos
  const { store, dispatch } = useGlobalReducer();
  const cartQty = store.cart?.reduce((s, it) => s + (it.qty || 0), 0) || 0;
  const [quantities, setQuantities] = useState({});

  const setQty = (id, value) => {
    const n = Math.max(1, parseInt(value || 1, 10));
    setQuantities(q => ({ ...q, [id]: n }));
  };

  const addToCart = (p) => {
    const qty = quantities[p.id] || 1;
    dispatch({ type: "add_to_cart", payload: { product: p, qty } });
    dispatch({ type: "open_cart" });
  };

  const getProducts = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);

    if (!response.ok) {
      throw Error('Error de petición HTTP: ', response.status)
    }
    const data = await response.json();
    dispatch({ type: 'load_products', payload: data.products });
    return data

  }

  useEffect(()=>{
    getProducts()
  }, [])

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="mb-2 text-success"><i className="fa-solid fa-store me-2"></i>ShopNow</h1>
        <p className="text-muted mb-1">Catálogo</p>
        <span className="badge bg-success"><i className="fa-solid fa-cart-shopping me-1"></i>{cartQty}</span>
      </div>

    
      <div className="row g-3">
        {store.products?.map((p) => (
          <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
            <div className="card h-100 shadow-sm">
              <img src={p.image} className="card-img-top" alt={p.name} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">{p.name}</h5>
                <span className="text-success fw-bold mb-3">
                  {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(p.price)}
                </span>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <label className="form-label m-0 small">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={quantities[p.id] || 1}
                    onChange={(e) => setQty(p.id, e.target.value)}
                    className="form-control"
                    style={{ width: 90 }}
                  />
                </div>

                <button onClick={() => addToCart(p)} className="btn btn-success mt-auto">
                  <i className="fa-solid fa-cart-plus me-2"></i>Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
        {!store.products?.length && (
          <div className="col-12">
            <div className="alert alert-secondary text-center mb-0">
              <i className="fa-regular fa-circle-xmark me-2"></i>Sin productos
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
