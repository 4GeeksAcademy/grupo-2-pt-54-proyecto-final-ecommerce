//Aqui van los productos de las categorias selecionadas

import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Products = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/category/${categoryId}/products`)
            .then(res => res.json())
            .then(data => setProducts(data.products))

            .catch(err => console.error(err))
    }, [categoryId]);

    if (products.length == 0) return <div>No hay productos para esta categoria...</div>;

    return (
        <div>
            {products.map((products) => {
                return (
                    <div key={products.id}>
                        <h2>{products.name}</h2>
                        <p>{products.description}</p>
                        <p>Price: ${products.price}</p>
                        <hr />
                    </div>
                )
            })}
            
        </div>

    )
}

// {categories.map((category) => (
//     <li key={category.id}>
//     <Link className="dropdown-item" to={`/category/${category.id}`}>
//         {category.name}
//     </Link>


// -CONSTRUIR UN ENDPOINT EN EL BACKEND QUE ME TRAIGA LOS PRODUCTOS SEGUN CATEGORIA POR ID
// -COMPONENTE CATEGORY.JSX LLAMAR A MI ENDPOINT Y RENDERIZAR LOS PRODUCTOS