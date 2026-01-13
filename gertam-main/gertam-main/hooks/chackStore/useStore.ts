import {useState, useEffect} from "react";



export const useStore = () => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>();



    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/storeOwnerCheck`,{
                    headers:{
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });
                const json = await res.json();
                if(json.authenticated === true && json.user.role === "store_owner"){
                    setAuthenticated(true);
                }else{
                    setAuthenticated(false);
                    localStorage.removeItem("token");
                    location.href="/Login";
                }
            }catch (error:any) {
                setError(error);
            }finally {
                setLoading(false);
            }
        }
        fetchData();
    },[])
    return {authenticated, loading, error};
}