import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer";

export const SearchResults = () => {
  const { store, dispatch } = useGlobalReducer();
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

  if (store.searchResults.length == 0) return <div>No hay productos para esta busqueda...</div>;

  return (
    <div className="container py-4">
      <div className="row g-3">
        {store.searchResults?.map((p) => (
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
                <Link to={`/product/${p.id}`} className="btn btn-success mt-auto">
                  <i className="fa-solid fa-cart-plus me-2"></i>Ver más
                </Link>
              </div>
            </div>
          </div>
        ))}
        {!store.searchResults?.length && (
          <div className="col-12">
            <div className="alert alert-secondary text-center mb-0">
              <i className="fa-regular fa-circle-xmark me-2"></i>Sin resultados de busqueda
            </div>
          </div>
        )}
      </div>
    </div>

  )
}



