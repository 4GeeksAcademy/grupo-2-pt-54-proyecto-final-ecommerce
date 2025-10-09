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
        <article className="card" style={{ width: "20rem", height: "720px", overflow: "hidden" }}>
            <img src={props.image} className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{props.name}</h5>
                <p className="card-text">
                    {props.description}
                </p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Price: {props.price}</li>
                <li className="list-group-item">Available Units: {props.stock}</li>
                <li className="list-group-item">Category: {store.categories?.find((e) => e.id == props.category_id)?.name || "Sin categoría"}</li>
            </ul>
            <div className="card-body d-flex justify-content-between">
                <Link className="my-auto" to={`/edit-product/${props.id}`}><i className="fa-solid fa-pen-to-square fa-2xl text-success"></i></Link>
                <i className="fa-solid fa-trash fa-2xl text-danger my-auto" onClick={() => props.onOpenModal(props.id)}></i>
            </div>
        </article>
    )
}
export default ProductCard