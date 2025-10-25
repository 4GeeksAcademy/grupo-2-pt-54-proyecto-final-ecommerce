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
                                <Elements stripe={stripePomise}>
                                    <CheckoutForm />
                                </Elements>
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
