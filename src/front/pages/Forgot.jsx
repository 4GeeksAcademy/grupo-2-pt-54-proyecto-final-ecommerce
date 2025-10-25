import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Forgot = () => {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) {
            setStatus('error')
            setMessage('Por favor ingresa un correo válido')
            return
        }

        try {
            setStatus('loading')
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/forgot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.msg || 'Error al solicitar restablecimiento')
            }

            setStatus('success')
            setMessage(data.msg || 'Revisa tu correo para restablecer la contraseña')
        } catch (err) {
            setStatus('error')
            setMessage(err.message || 'Error desconocido')
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            {status === 'loading' && (
                                <>
                                    <h3 className="mb-3">Enviando solicitud...</h3>
                                    <p className="text-muted">Espere un momento mientras procesamos su solicitud.</p>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <h1 className="text-success mb-3"><i className="fa-solid fa-envelope-circle-check me-2"></i>Solicitud enviada</h1>
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
                                        <Link to="/register" className="btn btn-primary">Registrar</Link>
                                        <Link to="/" className="btn btn-outline-secondary">Volver al inicio</Link>
                                    </div>
                                </>
                            )}

                            {status === 'idle' && (
                                <>
                                    <h3 className="mb-3">Restablecer contraseña</h3>
                                    <p className="text-muted">Ingrese el correo asociado a su cuenta y le enviaremos instrucciones para restablecer la contraseña.</p>
                                    <form onSubmit={handleSubmit} className="mt-4">
                                        <div className="mb-3 text-start">
                                            <label className="form-label">Correo electrónico</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="usuario@ejemplo.com"
                                            />
                                        </div>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button type="submit" className="btn btn-primary">Enviar</button>
                                            <Link to="/" className="btn btn-outline-secondary">Cancelar</Link>
                                        </div>
                                    </form>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forgot