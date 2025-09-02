import "./List.css";
import { fetchList, url, removeFood } from "../../API/foodApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

const List = () => {
    const queryClient = useQueryClient();

    const {data: list, isLoading, isError, error} = useQuery({
        queryKey: ["FoodList"],
        queryFn: fetchList,
        gcTime: 1000*60*60
    });

    const mutation = useMutation({
        mutationFn: removeFood,
        onSuccess: (res) => {
            queryClient.invalidateQueries(["FoodList"]);
            toast.success(res.message);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const handleRemove = (id) => {
        mutation.mutate(id);
    }

    if (isError){
        toast(error.message || "Something went wrong");
    }

    if (isLoading){
        return <Loader />;
    }

    return (
        <div className="list add flex-col">
            <p>All Food List</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {
                    list.map((item,index) => {
                        return (
                            <div className="list-table-format" key={index}>
                                <img src={`${url}/images/${item.image}`} alt={item.name} />
                                <p>{item.name}</p>
                                <p>{item.category}</p>
                                <p>${item.price}</p>
                                <p className="cursor" onClick={() => handleRemove(item._id)}>X</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default List;
