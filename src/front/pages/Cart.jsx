import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useState } from "react";


const stripePomise = loadStripe("pk_test_51SL5NSLOU9dM6CbHFAeRPL8rygWbVlYj4ZPVVZz80yUAehISmhDe6QBJ7NB3AtDoWJRwwIwjxdYF2nGMJyOdQ8Mm00jXO53coS")

const money = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error en el pago",
                text: error.message || "Hubo un problema al procesar el pago.",
                confirmButtonColor: "#d33",
            });
        } else {
            console.log("Pago exitoso:", paymentMethod);

            Swal.fire({
                icon: "success",
                title: "¡Pago realizado con éxito!",
                text: "Tu transacción se ha completado correctamente.",
                confirmButtonColor: "#28a745",
            });

            cardElement.clear();
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <CardElement className="form-control" />
            </div>
            <button
                className="btn btn-success w-100"
                type="submit"
                disabled={!stripe || loading}
            >
                {loading ? (
                    <span>
                        <i className="fa fa-spinner fa-spin me-2"></i>Procesando...
                    </span>
                ) : (
                    <span>
                        <i className="fa-solid fa-credit-card me-2"></i>Proceder al pago
                    </span>
                )}
            </button>
        </form>
    );
};


export const Cart = () => {
    const { store, dispatch } = useGlobalReducer();
    const { cart } = store;
    const isAuthenticated = sessionStorage.getItem("access_token");

    const subtotal = cart.reduce((s, it) => s + it.price * (it.qty || 1), 0);
    const envio = subtotal > 999 ? 0 : 99;
    const total = subtotal + envio;

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="m-0 text-success">
                    <i className="fa-solid fa-basket-shopping me-2"></i>Mi carrito
                </h2>
                <Link to="/" className="btn btn-outline-success rounded-pill">
                    <i className="fa-solid fa-arrow-left me-2"></i>Seguir comprando
                </Link>
            </div>

            {cart.length === 0 ? (
                <div className="alert alert-secondary d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm">
                    <i className="fa-regular fa-face-frown"></i>
                    Tu carrito está vacío.
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="list-group">
                            {cart.map((it) => (
                                <div
                                    key={it.id}
                                    className="list-group-item border-0 shadow-sm rounded-3 mb-3 p-3 d-flex align-items-center"
                                    style={{ background: "#fff" }}
                                >
                                    <div
                                        className="bg-light rounded d-flex align-items-center justify-content-center me-3"
                                        style={{ width: 76, height: 76 }}
                                    >
                                        <img
                                            src={it.image}
                                            alt={it.name}
                                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                        />
                                    </div>

                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-start justify-content-between">
                                            <div>
                                                <div className="fw-semibold">{it.name}</div>
                                                <div className="text-success fw-bold small">{money(it.price)}</div>
                                            </div>
                                            <span className="badge text-bg-light border small">
                                                <i className="fa-solid fa-truck-fast text-success me-1"></i>Rápido
                                            </span>
                                        </div>

                                        <div className="d-flex align-items-center gap-2 mt-3">
                                            <div className="input-group input-group-sm" style={{ width: 120 }}>
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    style={{ borderRadius: "8px 0 0 8px" }}
                                                    onClick={() => dispatch({ type: "decrease_from_cart", payload: it.id })}
                                                    aria-label="Disminuir"
                                                >
                                                    <i className="fa-solid fa-minus"></i>
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="form-control text-center"
                                                    value={it.qty || 1}
                                                    readOnly
                                                    style={{ borderLeft: "none", borderRight: "none", borderRadius: 0 }}
                                                />
                                                <button
                                                    className="btn btn-outline-success"
                                                    type="button"
                                                    style={{ borderRadius: "0 8px 8px 0" }}
                                                    onClick={() => dispatch({ type: "add_to_cart", payload: { product: it, qty: 1 } })}
                                                    aria-label="Aumentar"
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                </button>
                                            </div>

                                            <button
                                                className="btn btn-link text-danger btn-sm ms-2"
                                                onClick={() => dispatch({ type: "remove_from_cart", payload: it.id })}
                                                aria-label="Eliminar"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="ms-3 text-end">
                                        <div className="fw-bold">{money(it.price * (it.qty || 1))}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-body">
                                <h5 className="card-title mb-3 text-success">
                                    <i className="fa-solid fa-receipt me-2"></i>Resumen
                                </h5>
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="fw-semibold">{money(subtotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Envío</span>
                                    <span className={envio === 0 ? "text-success fw-semibold" : "fw-semibold"}>
                                        {envio === 0 ? "Gratis" : money(envio)}
                                    </span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fw-semibold">Total</span>
                                    <span className="fs-5 fw-bold text-success">{money(total)}</span>
                                </div>

                                <Elements stripe={stripePomise}>
                                    <CheckoutForm />
                                </Elements>

                                <button
                                    className="btn btn-link text-success w-100 mt-3"
                                    onClick={() => dispatch({ type: "clear_cart" })}
                                >
                                    <i className="fa-solid fa-trash-can me-2"></i>Vaciar carrito
                                </button>
                            </div>
                        </div>

                        <div className="text-muted small mt-2 d-flex align-items-center">
                            <i className="fa-solid fa-gift text-success me-2"></i>
                            Envío gratis a partir de $999 MXN.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
