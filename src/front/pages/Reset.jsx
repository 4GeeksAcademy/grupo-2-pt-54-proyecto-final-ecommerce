import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Reset = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('idle')


    if (password !== confirmPassword) {
      setError('contraseña no coinciden')
      return
    }

    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (!token) {
      setError('Token no encontrado en la URL')
      return
    }

    try {
      setStatus('loading')
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setError(data.msg || 'Error al restablecer la contraseña')
        return
      }

      setStatus('success')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Error desconocido')
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="mb-3">Restablecer contraseña</h3>

              <p className="text-muted">Ingrese su nueva contraseña.</p>

              <form onSubmit={handleSubmit} className="mt-4">

                <div className="mb-3 text-start">
                  <label className="form-label">Nueva contraseña</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                      placeholder="Nueva contraseña"
                      required
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Confirmar contraseña</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                      placeholder="Confirmar contraseña"
                      required
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(s => !s)} aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                      <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {status === 'loading' && (
                  <div className="mb-3">
                    <div className="text-center">Procesando...</div>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {status === 'success' && (
                  <div className="alert alert-success" role="status">
                    Contraseña actualizada correctamente. Ahora puedes iniciar sesión.
                  </div>
                )}

                <div className="d-flex justify-content-center gap-2">
                  <button type="submit" className="btn btn-primary">Guardar</button>
                  <Link to="/login" className="btn btn-outline-secondary">Volver</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reset