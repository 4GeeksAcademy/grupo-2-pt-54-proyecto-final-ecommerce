import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const money = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export const Cart = () => {
    const { store, dispatch } = useGlobalReducer();
    const { cart } = store;

    const subtotal = cart.reduce((s, it) => s + it.price * (it.qty || 1), 0);
    const envio = subtotal > 999 ? 0 : 99;
    const total = subtotal + envio;

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="m-0">
                    <i className="fa-solid fa-basket-shopping me-2"></i>Mi carrito
                </h2>
                <Link to="/" className="btn btn-outline-secondary">
                    <i className="fa-solid fa-arrow-left me-2"></i>Seguir comprando
                </Link>
            </div>

            {cart.length === 0 ? (
                <div className="alert alert-secondary">
                    <i className="fa-regular fa-face-frown me-2"></i>
                    Tu carrito está vacío.
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="list-group">
                            {cart.map((it) => (
                                <div key={it.id} className="list-group-item d-flex align-items-center">
                                    <img
                                        src={it.image}
                                        alt={it.name}
                                        className="rounded me-3"
                                        style={{ width: 72, height: 72, objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">{it.name}</div>
                                        <div className="text-success">{money(it.price)}</div>
                                        <div className="d-flex align-items-center gap-2 mt-2">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => dispatch({ type: "decrease_from_cart", payload: it.id })}
                                                aria-label="Disminuir"
                                            >
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                            <span className="px-2">{it.qty}</span>
                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() =>
                                                    dispatch({ type: "add_to_cart", payload: { product: it, qty: 1 } })
                                                }
                                                aria-label="Aumentar"
                                            >
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-link text-danger ms-2"
                                                onClick={() => dispatch({ type: "remove_from_cart", payload: it.id })}
                                                aria-label="Eliminar"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="ms-3 fw-bold">{money(it.price * (it.qty || 1))}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Resumen</h5>
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Subtotal</span>
                                    <span>{money(subtotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Envío</span>
                                    <span>{envio === 0 ? "Gratis" : money(envio)}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-semibold mb-3">
                                    <span>Total</span>
                                    <span>{money(total)}</span>
                                </div>
                                <button className="btn btn-success w-100">
                                    <i className="fa-solid fa-credit-card me-2"></i>Proceder al pago
                                </button>
                                <button
                                    className="btn btn-link text-danger w-100 mt-2"
                                    onClick={() => dispatch({ type: "clear_cart" })}
                                >
                                    <i className="fa-solid fa-trash-can me-2"></i>Vaciar carrito
                                </button>
                            </div>
                        </div>
                        <div className="text-muted small mt-2">
                            Envío gratis a partir de $999 MXN.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
