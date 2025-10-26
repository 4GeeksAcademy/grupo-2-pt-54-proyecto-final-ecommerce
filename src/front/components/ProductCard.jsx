import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import DeleteProduct from "./DeleteProduct";

const ProductCard = (props) => {

    const { store, dispatch } = useGlobalReducer()

    const getCategories = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`)

        if (!response.ok) {
            throw Error('Error de petición HTTP: ', response.status)
        }
        const data = await response.json();
        dispatch({ type: 'load_categories', payload: data.categories });
        return data
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <article
            className="card h-100 border-0 shadow-sm rounded-3 position-relative overflow-hidden bg-white"
            style={{ minWidth: 200, maxWidth: 260 }}
        >
            <div className="bg-light" style={{ height: 150, overflow: "hidden" }}>
                <img
                    src={props.image}
                    alt={props.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", transition: "transform .25s" }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
            </div>

            <div className="card-body p-2 d-flex flex-column">
                <h6 className="text-truncate mb-1 fw-semibold text-dark" title={props.name}>
                    <i className="fa-solid fa-box me-1 text-muted"></i>
                    {props.name}
                </h6>

                <p className="small text-muted mb-2 text-truncate" style={{ lineHeight: "1.2em" }}>
                    {props.description}
                </p>

                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-success fw-bold small">
                        {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(props.price)}
                    </span>
                    <span className="badge text-bg-light border small">
                        <i className="fa-solid fa-boxes-stacked text-success me-1"></i>
                        {props.stock}
                    </span>
                </div>

                <div className="text-muted small mb-2">
                    <i className="fa-solid fa-layer-group me-1 text-success"></i>
                    {store.categories?.find((e) => e.id == props.category_id)?.name || "Sin categoría"}
                </div>

                <div className="d-flex justify-content-between mt-auto pt-2 border-top">
                    <Link className="btn btn-outline-success btn-sm rounded-pill" to={`/edit-product/${props.id}`}>
                        <i className="fa-solid fa-pen-to-square me-1"></i>Editar
                    </Link>
                    <button
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        onClick={() => props.onOpenModal(props.id)}
                    >
                        <i className="fa-solid fa-trash me-1"></i>Eliminar
                    </button>
                </div>
            </div>
        </article>
    );
};
export default ProductCard