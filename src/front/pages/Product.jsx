
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Product = () => {
    const { productId } = useParams();
    const { dispatch } = useGlobalReducer();
    const [product, setProduct] = useState(null);
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
                <div className="col-12 col-lg-10">
                    <div
                        className="card border-0 shadow-lg rounded-4 overflow-hidden"
                        style={{
                            backgroundColor: "#111",
                            color: "#f8f9fa",
                        }}
                    >
                        <div className="row g-0 align-items-center">
                            <div className="col-12 col-md-6 bg-dark d-flex align-items-center justify-content-center p-4">
                                <div
                                    className="bg-black rounded-4 d-flex align-items-center justify-content-center w-100"
                                    style={{ minHeight: 420 }}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="img-fluid rounded-3 shadow"
                                        style={{
                                            maxHeight: 420,
                                            objectFit: "contain",
                                            transition: "transform .3s ease",
                                        }}
                                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 p-5">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h2 className="card-title text-success fw-bold mb-0">
                                        {product.name}
                                    </h2>
                                    <span className="badge bg-success-subtle border border-success text-success">
                                        <i className="fa-solid fa-truck-fast me-1"></i>Rápido
                                    </span>
                                </div>

                                <p className="text-secondary mb-4 fs-6">{product.description}</p>

                                <div className="mb-4">
                                    <span className="text-light me-2 fs-5">Precio:</span>
                                    <span className="fs-3 fw-bold text-success">
                                        ${product.price}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small text-muted">Cantidad</label>
                                    <div className="input-group input-group-sm" style={{ maxWidth: 200 }}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-success border-success text-light"
                                            style={{ borderRadius: "8px 0 0 8px" }}
                                            onClick={() => setQuantity(Math.max(1, (quantity || 1) - 1))}
                                        >
                                            <i className="fa-solid fa-minus"></i>
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control text-center bg-dark text-light border-success"
                                            value={quantity}
                                            onChange={(e) =>
                                                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                            }
                                            style={{ borderLeft: "none", borderRight: "none", borderRadius: 0 }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-success border-success text-light"
                                            style={{ borderRadius: "0 8px 8px 0" }}
                                            onClick={() => setQuantity((quantity || 1) + 1)}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-success w-100 py-2 fw-semibold shadow-sm"
                                    onClick={handleAddToCart}
                                >
                                    <i className="fa-solid fa-cart-plus me-2"></i>Agregar al carrito
                                </button>

                                <Link
                                    to="/"
                                    className="btn btn-outline-success w-100 mt-3 fw-semibold"
                                >
                                    <i className="fa-solid fa-arrow-left me-2"></i>Volver al catálogo
                                </Link>

                                <div className="mt-4 small text-center">
                                    <i className="fa-solid fa-shield-halved text-success me-2"></i>
                                    Compra segura • Envíos en menos de 48h
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
