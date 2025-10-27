import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { Link, useNavigate, useParams } from "react-router-dom";

const FormProduct = (props) => {
    const [product, setProduct] = useState({});
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate();
    const params = useParams()

    const getCategories = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`)

        if (!response.ok) {
            throw Error('Error de petición HTTP: ', response.status)
        }
        const data = await response.json();
        dispatch({ type: 'load_categories', payload: data.categories });
        return data
    }

    useEffect(() => {
        getCategories()
        if (params.hasOwnProperty('productId')) {
            const productId = store.products.filter(p => p.id === Number(params.productId));
            setProduct({ ...productId[0] });
        }
    }, [])

    useEffect(() => {
        if (store.categories.length > 0 && !product.category_id) {
            setProduct((prev) => ({
                ...prev,
                category_id: store.categories[0].id, 
            }));
        }
    }, [store.categories]);

    const handleOnChange = (event) => {
        const { id, value, files } = event.target;

        if (id === "image" && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct((prev) => ({ ...prev, image: reader.result, vendor_id: store.user_info.id })); // Base64
            };
            reader.readAsDataURL(file);
        } else {
            setProduct((prev) => ({ ...prev, [id]: value, vendor_id: store.user_info.id }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendors${params.hasOwnProperty('productId') ? "/update_product/" + params.productId : "/create_product"}`,
                {
                    method: `${params.hasOwnProperty('productId') ? 'PUT' : 'POST'}`,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product),
                }
            );
            if (!response.ok) {
                console.error("Error al crear el producto ", response.statusText)
            }
            const dataJson = await response.json();
            console.log('Producto creado correctamente:', dataJson);
            navigate("/all-products");
        } catch (e) {
            console.error('Error al crear el producto:', e);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-8">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-header bg-dark text-light d-flex align-items-center">
                            <i className="fa-solid fa-box-open me-2 text-success"></i>
                            <h5 className="mb-0">{props.title}</h5>
                        </div>

                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label small text-muted">
                                        <i className="fa-solid fa-tag me-1"></i>Name
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="fa-solid fa-pen"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Name"
                                            onChange={handleOnChange}
                                            value={product.name}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label small text-muted">
                                        <i className="fa-regular fa-file-lines me-1"></i>Description
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="fa-solid fa-align-left"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="description"
                                            placeholder="Description"
                                            onChange={handleOnChange}
                                            value={product.description}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label small text-muted">
                                        <i className="fa-solid fa-dollar-sign me-1"></i>Price
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="fa-solid fa-money-bill-wave"></i>
                                        </span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="price"
                                            placeholder="Price"
                                            onChange={handleOnChange}
                                            value={product.price}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label small text-muted">
                                        <i className="fa-regular fa-image me-1"></i>Image
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="fa-solid fa-upload"></i>
                                        </span>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="stock" className="form-label small text-muted">
                                        <i className="fa-solid fa-boxes-stacked me-1"></i>Stock
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="fa-solid fa-hashtag"></i>
                                        </span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="stock"
                                            placeholder="Enter Stock"
                                            onChange={handleOnChange}
                                            value={product.stock}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="category_id" className="form-label small text-muted">
                                        <i className="fa-solid fa-layer-group me-1"></i>Category
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="fa-regular fa-folder-open"></i>
                                        </span>
                                        <select
                                            id="category_id"
                                            name="category"
                                            className="form-select"
                                            aria-label="Default select example"
                                            onChange={handleOnChange}
                                            value={product.category_id}
                                        >
                                            {store.categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-success w-100">
                                    <i className="fa-solid fa-floppy-disk me-2"></i>Save
                                </button>

                                <div className="text-center mt-3">
                                    <Link to="/all-products" className="text-decoration-none text-success">
                                        <i className="fa-solid fa-arrow-left-long me-2"></i>Back to Products
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default FormProduct