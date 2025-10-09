import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { Link, useNavigate, useParams } from "react-router-dom";

const FormProduct = (props) => {
    const [product, setProduct] = useState({"vendor_id": 4});
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
        if (params.hasOwnProperty('productId')){
            const productId = store.products.filter(p=>p.id === Number(params.productId));
            setProduct({...productId[0]});
        }
    }, [])

    const handleOnChange = (event) => {
        const { id, value, files } = event.target;

        if (id === "image" && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProduct((prev) => ({ ...prev, image: reader.result })); // Base64
        };
        reader.readAsDataURL(file);
        } else {
        setProduct((prev) => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendors${params.hasOwnProperty('productId') ? "/update_product/"+params.productId : "/create_product"}`,
                {
                    method: `${params.hasOwnProperty('productId') ? 'PUT': 'POST'}`,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product),
                }
            );

            const dataJson = await response.json();
            console.log('Producto creado correctamente:', dataJson);
            navigate("/all-products");
        } catch (e) {
            console.error('Error al crear el producto:', e);
        }
    };

    return (
        <div className='container'>
            <h1 className='text-center'>{props.title}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" placeholder='Name' onChange={handleOnChange} value={product.name}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" placeholder='Description' onChange={handleOnChange} value={product.description} />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" placeholder='Price' onChange={handleOnChange} value={product.price} />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input type="file" className="form-control" id="image" placeholder='Enter Image' onChange={handleOnChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input type="number" className="form-control" id="stock" placeholder='Enter Stock' onChange={handleOnChange} value={product.stock} />
                </div>
                <div className="mb-3">
                    <label htmlFor="category_id" className="form-label">Category</label>
                    <select id="category_id" name="category" class="form-select" aria-label="Default select example" onChange={handleOnChange} value={product.category_id}> 
                        {store.categories.map((category)=>{
                            return (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            )
                        })}
                    </select>
                </div>
                <button type='submit' className="btn btn-success w-100">
                    Submit
                </button>
                <Link to="/all-products">or get back to products</Link>
            </form>
        </div>
    )
}
export default FormProduct