import { useEffect,useState } from "react";
import { getTotalSum } from "../services/expenseServices";

const TotalSum = () => {
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTotal = async () => {
            try{
                const data = await getTotalSum();
                setTotal(data);
            }
            catch(err){
                console.error("Failed to fetch Total: ",err);
            }
            finally{
                setLoading(false);
            }
        };
        fetchTotal();
    },[]);

    return(
        <div className="bg-white rounded-2xl shadow-md p-6  w-fit">
            <p className="text-sm text-gray-500 mb-1">
                Total Expenses
            </p>
            {loading ?(
                <p className="text-2xl font-bold  text-gray-400">Loading...</p>
            ):(
                <p className="text-3xl font-bold text-red-500">&#8377; {total}</p>
            )}
        </div>
    );
};

export default TotalSum;