import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import DeleteProduct from "../components/DeleteProduct";

const AllProducts = () => {
  const { store, dispatch } = useGlobalReducer()
  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState(undefined);

  const getProducts = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);

    if (!response.ok) {
      throw Error('Error de petición HTTP: ', response.status)
    }
    const data = await response.json();
    dispatch({ type: 'load_products', payload: data.products });
    return data

  }

  useEffect(() => {
    getProducts()
  }, [])

  function handleOpenModal(productId) {
    setShowModal(true);
    setProductId(productId);
  }
  function handleCancel(event) {
    setShowModal(false);
  }

  const handleDeleteProduct = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/delete_product/${productId}`,
      {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' }
      }
    )
    if (!response.ok) {
      throw Error('Error en la petición HTTP: ', response.status)
    }
    setShowModal(false);
    getProducts();
  }

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="mb-2 text-success"><i className="fa-solid fa-store me-2"></i>ShopNow</h1>
        <p className="text-muted mb-1">Inventario</p>
        <Link to="/new-product"><i className="fa-solid fa-cart-plus text-success fa-xl"></i></Link>
      </div>

      <section className="row">
        {store.products.map((p) => {
          return (
            <div key={p.id} className="col">
              <ProductCard id={p.id} image={p.image} name={p.name} description={p.description} price={p.price} stock={p.stock} category_id={p.category_id} onOpenModal={handleOpenModal} />
            </div>
          )
        })}
      </section>
      <DeleteProduct show={showModal} onCancel={handleCancel} onDelete={handleDeleteProduct} />
    </div>
  )
}
export default AllProducts