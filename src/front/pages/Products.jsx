//Aqui van los productos de las categorias selecionadas

import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

export const Products = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/category/${categoryId}/products`)
            .then(res => res.json())
            .then(data => setProducts(data.products))

            .catch(err => console.error(err))
    }, [categoryId]);

    const [quantities, setQuantities] = useState({});

    const setQty = (id, value) => {
        const n = Math.max(1, parseInt(value || 1, 10));
        setQuantities(q => ({ ...q, [id]: n }));
    };

    const addToCart = (p) => {
        const qty = quantities[p.id] || 1;
        // Aquí deberías usar tu dispatch global si tienes carrito global
        // dispatch({ type: "add_to_cart", payload: { product: p, qty } });
        // dispatch({ type: "open_cart" });
        alert(`Agregado ${qty} de ${p.name} al carrito (implementa tu lógica)`);
    };

    if (products.length === 0) return <div>No hay productos para esta categoria...</div>;

    return (
        <div className="container py-4">
            <section className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
                {products.map((p) => (
                    <div key={p.id} className="col">
                        <article className="card h-100 border-0 shadow-sm rounded-3 position-relative bg-white overflow-hidden">
                            <div
                                className="bg-light d-flex align-items-center justify-content-center"
                                style={{ height: 160, backgroundColor: "#f8f9fa" }}
                            >
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-auto h-100"
                                    style={{ objectFit: "contain", transition: "transform .25s ease-in-out" }}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                />
                            </div>

                            <div className="card-body p-2 d-flex flex-column">
                                <h6 className="text-truncate mb-1 fw-semibold" title={p.name}>
                                    <i className="fa-solid fa-box me-1 text-muted"></i>{p.name}
                                </h6>

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-success fw-bold small">
                                        {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(p.price)}
                                    </span>
                                    <span className="badge text-bg-light border small">
                                        <i className="fa-solid fa-truck-fast text-success me-1"></i>Rápido
                                    </span>
                                </div>

                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <div className="input-group input-group-sm" style={{ width: 120 }}>
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            style={{ borderRadius: "6px 0 0 6px" }}
                                            onClick={() => setQty(p.id, Math.max(1, (quantities[p.id] || 1) - 1))}
                                        >
                                            <i className="fa-solid fa-minus"></i>
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control text-center"
                                            value={quantities[p.id] || 1}
                                            onChange={(e) => setQty(p.id, e.target.value)}
                                            style={{ borderLeft: "none", borderRight: "none", borderRadius: 0, appearance: "textfield", MozAppearance: "textfield" }}
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            style={{ borderRadius: "0 6px 6px 0" }}
                                            onClick={() => setQty(p.id, (quantities[p.id] || 1) + 1)}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="d-grid gap-1 mt-auto">
                                    <button onClick={() => addToCart(p)} className="btn btn-success btn-sm">
                                        <i className="fa-solid fa-cart-plus me-1"></i>Agregar
                                    </button>
                                    <Link to={`/product/${p.id}`} className="btn btn-outline-success btn-sm">
                                        <i className="fa-solid fa-eye me-1"></i>Ver más
                                    </Link>
                                </div>
                            </div>

                            <button
                                className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 border rounded-circle"
                                style={{ width: 28, height: 28, padding: 0 }}
                            >
                                <i className="fa-regular fa-bookmark"></i>
                            </button>
                        </article>
                    </div>
                ))}
            </section>

            <div className="mt-4">
                <Link to="/" className="btn btn-outline-secondary">Regresar</Link>
            </div>
        </div>
    );
};

// {categories.map((category) => (
//     <li key={category.id}>
//     <Link className="dropdown-item" to={`/category/${category.id}`}>
//         {category.name}
//     </Link>


// -CONSTRUIR UN ENDPOINT EN EL BACKEND QUE ME TRAIGA LOS PRODUCTOS SEGUN CATEGORIA POR ID
// -COMPONENTE CATEGORY.JSX LLAMAR A MI ENDPOINT Y RENDERIZAR LOS PRODUCTOS