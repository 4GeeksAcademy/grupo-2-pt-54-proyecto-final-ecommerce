
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Product = () => {
    const { productId } = useParams();
    const { dispatch } = useGlobalReducer();
    const [zproduct, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`);
                if (!response.ok) throw new Error("Producto no encontrado");
                const data = await response.json();
                setProduct(data.products);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        dispatch({ type: "add_to_cart", payload: { product, qty: quantity } });
        dispatch({ type: "open_cart" });
    };

    if (loading) return <div className="container py-5 text-center"><h3>Cargando producto...</h3></div>;
    if (error) return <div className="container py-5 text-center text-danger"><h3>{error}</h3></div>;
    if (!product) return null;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <img src={product.image} alt={product.name} className="card-img-top" style={{ maxHeight: 350, objectFit: "contain" }} />
                        <div className="card-body">
                            <h2 className="card-title mb-2 text-success">{product.name}</h2>
                            <p className="card-text mb-3">{product.description}</p>
                            <h4 className="mb-3">Precio: <span className="text-success">${product.price}</span></h4>
                            <div className="d-flex align-items-center mb-3">
                                <label className="form-label me-2">Cantidad:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="form-control"
                                    style={{ width: 90 }}
                                />
                            </div>
                            <button className="btn btn-success w-100 " onClick={handleAddToCart}>
                                <i className="fa-solid fa-cart-plus me-2"></i>Agregar al carrito
                            </button>
                            <Link to="/" className="btn btn-link mt-3">Volver al catálogo</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
