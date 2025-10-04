import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const money = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export default function CartDrawer() {
    const { store, dispatch } = useGlobalReducer();
    const { drawer, cart } = store;

    if (!drawer) return null;

    const subtotal = cart.reduce((s, it) => s + it.price * (it.qty || 1), 0);
    const envio = subtotal > 999 ? 0 : 99;
    const total = subtotal + envio;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }}>
            <div
                className="w-100 h-100 bg-dark bg-opacity-50"
                onClick={() => dispatch({ type: "close_cart" })}
            />
            <aside
                className="position-absolute top-0 end-0 bg-white shadow p-3 d-flex flex-column"
                style={{ width: 420, height: "100%" }}
            >
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h5 className="m-0 text-success"><i className="fa-solid fa-basket-shopping me-2"></i>Carrito</h5>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => dispatch({ type: "close_cart" })}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="flex-grow-1 overflow-auto">
                    {cart.length === 0 ? (
                        <p className="text-muted"><i className="fa-regular fa-face-frown me-2"></i>Vacío</p>
                    ) : (
                        cart.map((it) => (
                            <div key={it.id} className="d-flex align-items-center gap-2 py-2 border-bottom">
                                <img src={it.image} alt={it.name} className="rounded" style={{ width: 64, height: 64, objectFit: "cover" }} />
                                <div className="flex-grow-1">
                                    <div className="small fw-semibold">{it.name}</div>
                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => dispatch({ type: "decrease_from_cart", payload: it.id })}
                                        >
                                            <i className="fa-solid fa-minus"></i>
                                        </button>
                                        <span>{it.qty}</span>
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => dispatch({ type: "add_to_cart", payload: { product: it, qty: 1 } })}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="small fw-bold">{money(it.price * (it.qty || 1))}</div>
                                <button
                                    className="btn btn-sm btn-link text-danger"
                                    onClick={() => dispatch({ type: "remove_from_cart", payload: it.id })}
                                >
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-top pt-2">
                    <div className="d-flex justify-content-between small"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                    <div className="d-flex justify-content-between small"><span>Envío</span><span>{envio === 0 ? "Gratis" : money(envio)}</span></div>
                    <div className="d-flex justify-content-between fw-semibold"><span>Total</span><span>{money(total)}</span></div>

                    <Link
                        to="/cart"
                        className="btn btn-success w-100 mt-2"
                        onClick={() => dispatch({ type: "close_cart" })}
                    >
                        <i className="fa-solid fa-credit-card me-2"></i>Proceder al pago
                    </Link>
                </div>
            </aside>
        </div>
    );
}
