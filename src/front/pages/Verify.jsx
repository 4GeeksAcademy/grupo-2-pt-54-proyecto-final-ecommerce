import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const Verify = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token no proporcionado.');
            return;
        }

        const verifyAccount = async () => {
            try {
                setStatus('loading');
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify/${encodeURIComponent(token)}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.msg || 'Error al verificar la cuenta');
                }
                setStatus('success');
                setMessage(data.msg || 'Cuenta verificada correctamente');
            } catch (err) {
                setStatus('error');
                setMessage(err.message || 'Error desconocido');
            }
        };

        verifyAccount();
    }, [token]);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            {status === 'loading' && (
                                <>
                                    <h3 className="mb-3">Verificando cuenta...</h3>
                                    <p className="text-muted">Espere un momento mientras validamos su cuenta.</p>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <h1 className="text-success mb-3"><i className="fa-solid fa-check-circle me-2"></i>Cuenta verificada</h1>
                                    <p className="mb-4">{message}</p>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Link to="/login" className="btn btn-success">Iniciar sesión</Link>
                                        <Link to="/" className="btn btn-outline-secondary">Volver al inicio</Link>
                                    </div>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <h1 className="text-danger mb-3"><i className="fa-solid fa-circle-exclamation me-2"></i>Error</h1>
                                    <p className="mb-4">{message}</p>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Link to="/register" className="btn btn-primary">Registrar nuevamente</Link>
                                        <Link to="/" className="btn btn-outline-secondary">Volver al inicio</Link>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Verify