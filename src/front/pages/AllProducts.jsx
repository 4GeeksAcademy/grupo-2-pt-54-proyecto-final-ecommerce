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
      <h1 className="mb-2 text-success">
        <i className="fa-solid fa-store me-2"></i>ShopNow
      </h1>
      <p className="text-muted mb-1">Inventario</p>
      <div className="d-flex justify-content-center align-items-center gap-3 mt-2">
        <span className="badge bg-success-subtle border border-success text-success">
          <i className="fa-solid fa-boxes-stacked me-2"></i>{store.products?.length || 0} productos
        </span>
        <Link to="/new-product" className="btn btn-success btn-sm rounded-pill">
          <i className="fa-solid fa-plus me-2"></i>Nuevo producto
        </Link>
      </div>
    </div>

    <div className="bg-black rounded-3 p-3 mb-3 border border-success-subtle">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="text-success fw-semibold d-flex align-items-center">
          <i className="fa-solid fa-layer-group me-2"></i>Gestión de catálogo
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-dark border">
            <i className="fa-regular fa-circle-check me-2 text-success"></i>Activo
          </span>
          <Link to="/new-product" className="btn btn-outline-success btn-sm">
            <i className="fa-solid fa-cart-plus me-2"></i>Agregar
          </Link>
        </div>
      </div>
    </div>

    {store.products?.length ? (
      <section className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
        {store.products.map((p) => (
          <div key={p.id} className="col">
            <ProductCard
              id={p.id}
              image={p.image}
              name={p.name}
              description={p.description}
              price={p.price}
              stock={p.stock}
              category_id={p.category_id}
              onOpenModal={handleOpenModal}
            />
          </div>
        ))}
      </section>
    ) : (
      <div className="alert alert-secondary d-flex align-items-center justify-content-center gap-2">
        <i className="fa-regular fa-circle-xmark"></i>
        No hay productos aún
      </div>
    )}

    <DeleteProduct show={showModal} onCancel={handleCancel} onDelete={handleDeleteProduct} />
  </div>
);

}
export default AllProducts