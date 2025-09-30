import { useState } from "react"


export const Login = () => {

    const [newUser, setNewUser] = useState({'role': 'USER'});

    const [user, setUser] = useState({});

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

    

    const handleRegistro = async () =>{
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registro`,
                {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                }
            );
            if (!response.ok){
                throw new Error("Error al registrar usuario");

            }
        }catch(err){
            console.error(error)
        }
    }

    const handleLogin = async () =>{
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`,
                {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                }
            );
            if (!response.ok){
                throw new Error("Error al registrar usuario");

            }

            const body = await response.json();
            sessionStorage.setItem("access_token", body.access_token)

        }catch(err){
            console.error(error)
        }
    }


    return (
        <>
            <div className="section">
                <div className="container">
                    <div className="row full-height justify-content-center">
                        <div className="col-12 text-center align-self-center py-5">
                            <div className="section pb-5 pt-5 pt-sm-2 text-center">
                                <h6 className="mb-0 pb-3">
                                    <span>Log In </span>
                                    <span>Sign Up</span>
                                </h6>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    id="reg-log"
                                    name="reg-log"
                                />
                                <label htmlFor="reg-log" />
                                <div className="card-3d-wrap mx-auto">
                                    <div className="card-3d-wrapper">
                                        <div className="card-front">
                                            <div className="center-wrap">
                                                <div className="section text-center">
                                                    <h4 className="mb-4 pb-3">Log In</h4>
                                                    <div className="form-group">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-style"
                                                            placeholder="Your Email"
                                                            id="email"
                                                            autoComplete="off"
                                                            onChange={handleOnchangeLogin}
                                                        />
                                                        <i class="fa-solid fa-envelope input-icon"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            className="form-style"
                                                            placeholder="Your Password"
                                                            id="password"
                                                            autoComplete="off"
                                                            onChange={handleOnchangeLogin}
                                                        />
                                                        <i class="fa-solid fa-lock uil uil-lock-al input-icon"></i>
                                                    </div>
                                                    <a  className="btn mt-4" onClick={handleLogin}>
                                                        submit
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-back">
                                            <div className="center-wrap">
                                                <div className="section text-center">
                                                    <h4 className="mt-2 mb-4 pb-3">Sign Up</h4>
                                                    <div className="form-group">
                                                        <div className="d-flex">
                                                            <input
                                                                type="text"
                                                                name="first_name"
                                                                className="form-style"
                                                                placeholder="First Name"
                                                                id="first-name"
                                                                autoComplete="off"
                                                                onChange={handleOnchangeRegistro}
                                                            />
                                                            <input
                                                                type="text"
                                                                name="last_name"
                                                                className="form-style"
                                                                placeholder="Last Name"
                                                                id="last-name"
                                                                autoComplete="off"
                                                                onChange={handleOnchangeRegistro}
                                                            />
                                                        </div>
                                                        <i class="fa-solid fa-user input-icon"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-style"
                                                            placeholder="Your Email"
                                                            id="email"
                                                            autoComplete="off"
                                                            onChange={handleOnchangeRegistro}
                                                        />
                                                        <i class="fa-solid fa-envelope input-icon"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            className="form-style"
                                                            placeholder="Your Password"
                                                            id="password"
                                                            autoComplete="off"
                                                            onChange={handleOnchangeRegistro}
                                                        />
                                                        <i class="fa-solid fa-lock input-icon"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <label For="role">Select Option</label>
                                                        <select name="role" id="role" className="form-style" onChange={handleOnchangeRegistro}>
                                                            <option value="USER">Purchase</option>
                                                            <i class="fa-solid fa-lock input-icon"></i>
                                                            <option value="SELLER">Sale</option>
                                                        </select>
                                                    </div>
                                                    <a className="btn mt-4" onClick={handleRegistro}>
                                                        submit
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
