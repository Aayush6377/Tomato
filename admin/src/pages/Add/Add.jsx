import { useState } from "react";
import { assets } from "../../assets/assets";
import "./Add.css";
import { addFood } from "../../API/foodApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Add = () => {
    const [image,setImage] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: ""
    });

    const mutation = useMutation({
        mutationFn: addFood,
        onSuccess: (res) => {
            setFormData({
                name: "",
                description: "",
                category: "",
                price: ""
            });
            setImage(false);
            toast.success(res.message);
        },

        onError: (err) => {
            toast.error(err.message);
        },
    });

    const handleForm = (e) => {
        setFormData((prev) => {
            return {...prev, [e.target.name]: e.target.value}
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append("image", image);
        submitData.append("name", formData.name);
        submitData.append("description", formData.description);
        submitData.append("category", formData.category);
        submitData.append("price", Number(formData.price));

        mutation.mutate(submitData);
    }



    return (
        <div className="add">
            <form onSubmit={handleSubmit} className="flex-col">
                <div className="add-image-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input type="text" name="name" placeholder="Type here" required onChange={handleForm} value={formData.name}/>
                </div>
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea name="description" rows="6" placeholder="Write content here" required onChange={handleForm} value={formData.description}/>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select name="category" required onChange={handleForm} value={formData.category || ""}>
                            <option value="" disabled>Select category</option>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input type="number" name="price" id="price" placeholder="$20" required onChange={handleForm} value={formData.price}/>
                    </div>
                </div>
                <button type="submit" className={`add-btn ${mutation.isPending ? "adding-btn" : ""}`} disabled={mutation.isPending}>
                    {mutation.isPending? "Adding..." : "Add Food"}
                </button>
            </form>
        </div>
    )
}

export default Add;
