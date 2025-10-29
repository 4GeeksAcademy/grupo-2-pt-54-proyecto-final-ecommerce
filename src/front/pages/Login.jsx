import { useState } from "react"
import { Navigate, useNavigate, Link } from "react-router-dom";


export const Login = () => {

    const [newUser, setNewUser] = useState({ 'role': 'USER' });
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const handleOnchangeRegistro = (event) => {
        const target = event.target;

        setNewUser({
            ...newUser,
            [target.name]: target.value
        })
    }

    const handleOnchangeLogin = (event) => {
        const target = event.target;

        setUser({
            ...user,
            [target.name]: target.value
        })
    }



    const handleRegistro = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registro`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                }
            );
            if (!response.ok) {
                throw new Error("Error al registrar usuario");
            }

            // Si llega aquí, el registro fue exitoso -> mostrar confirmación,
            // limpiar el formulario de registro y volver a la pestaña de Login.
            const body = await response.json();
            // Mensaje al usuario (puedes reemplazar por un toast si tienes uno)
            alert('Cuenta creada con éxito. Por favor, inicia sesión.');
            // Desmarcar el checkbox para mostrar la tarjeta de Login (si existe)
            const regLogCheckbox = document.getElementById('reg-log');
            if (regLogCheckbox) regLogCheckbox.checked = false;
            // Limpiar datos del formulario de registro pero mantener role por defecto
            setNewUser({ role: 'USER' });
            navigate("/cart")
        } catch (err) {
            console.error(err)
        }
    }

    const handleLogin = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                }
            );
            if (!response.ok) {
                throw new Error("Error al registrar usuario");

            }

            const body = await response.json();
            sessionStorage.setItem("access_token", body.access_token)
            console.log("el token es:")
            console.log(body.access_token)
            navigate("/cart")

        } catch (err) {
            console.error(err)
        }
    }


    return (
        <div className="section bg-black text-light min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 text-center align-self-center py-5">
                        <div className="pb-5 pt-5 text-center">

                            <input className="checkbox d-none" type="checkbox" id="reg-log" name="reg-log" />

                            <div className="auth-tabs d-flex justify-content-center mb-4">
                                <div className="auth-toggle">
                                    <label htmlFor="reg-log" className="tab login">
                                        <i className="fa-solid fa-right-to-bracket me-2"></i>Login
                                    </label>
                                    <label htmlFor="reg-log" className="tab signup">
                                        <i className="fa-solid fa-user-plus me-2"></i>Sign Up
                                    </label>
                                    <div className="knob"></div>
                                </div>
                            </div>

                            <div className="card-3d-wrap mx-auto" style={{ maxWidth: 420 }}>
                                <div className="card-3d-wrapper">
                                    <div className="card-front text-success">
                                        <div className="center-wrap">
                                            <div className="section text-center">
                                                <h4 className="mb-4 pb-3 text-success">Log In</h4>
                                                <div className="form-group position-relative">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-style bg-dark text-light border-0 rounded-3 shadow-sm"
                                                        placeholder="Your Email"
                                                        id="log-email"
                                                        autoComplete="off"
                                                        onChange={handleOnchangeLogin}
                                                    />
                                                    <i className="fa-solid fa-envelope input-icon text-success"></i>
                                                </div>
                                                <div className="form-group mt-2 position-relative">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        className="form-style bg-dark text-light border-0 rounded-3 shadow-sm"
                                                        placeholder="Your Password"
                                                        id="log-password"
                                                        autoComplete="off"
                                                        onChange={handleOnchangeLogin}
                                                    />
                                                    <i className="fa-solid fa-lock input-icon text-success"></i>
                                                </div>
                                                {/* Enlace para restablecer contraseña */}
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <Link to="/reset-password" className="small text-success" style={{ textDecoration: 'none' }}>
                                                        <i className="fa-solid fa-key me-1"></i>Olvidé mi contraseña
                                                    </Link>
                                                </div>

                                                <a className="btn btn-success mt-3 w-100 rounded-pill" onClick={handleLogin}>
                                                    Submit
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-back">
                                        <div className="center-wrap">
                                            <div className="section text-center">
                                                <h4 className="mt-2 text-success mb-4 pb-3">Sign Up</h4>
                                                <div className="form-group position-relative">
                                                    <div className="d-flex gap-2">
                                                        <input
                                                            type="text"
                                                            name="first_name"
                                                            className="form-style bg-dark text-light border-0 rounded-3 shadow-sm"
                                                            placeholder="First Name"
                                                            id="first-name"
                                                            autoComplete="off"
                                                            onChange={handleOnchangeRegistro}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="last_name"
                                                            className="form-style bg-dark text-light border-0 rounded-3 shadow-sm"
                                                            placeholder="Last Name"
                                                            id="last-name"
                                                            autoComplete="off"
                                                            onChange={handleOnchangeRegistro}
                                                        />
                                                    </div>
                                                    <i className="fa-solid fa-user input-icon text-success"></i>
                                                </div>
                                                <div className="form-group mt-2 position-relative">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-style bg-dark text-light border-0 rounded-3 shadow-sm"
                                                        placeholder="Your Email"
                                                        id="sign-email"
                                                        autoComplete="off"
                                                        onChange={handleOnchangeRegistro}
                                                    />
                                                    <i className="fa-solid fa-envelope input-icon text-success"></i>
                                                </div>
                                                <div className="form-group mt-2 position-relative">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        className="form-style bg-dark text-light border-0 rounded-3 shadow-sm"
                                                        placeholder="Your Password"
                                                        id="sign-password"
                                                        autoComplete="off"
                                                        onChange={handleOnchangeRegistro}
                                                    />
                                                    <i className="fa-solid fa-lock input-icon text-success"></i>
                                                </div>
                                                <a className="btn btn-success mt-4 w-100 rounded-pill" onClick={handleRegistro}>
                                                    Submit
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="mt-4 small">
                                <i className="text-success me-2"></i>
                                Tus datos están protegidos
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
