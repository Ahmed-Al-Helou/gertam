import {useState, useEffect} from "react";

export type UserData = {
    id: number;
    email: string;
    avatar_url: string;
    country: string;
    name: string;
    role: string;
    phone: string;
}

export const useUser = () => {
    const [userData, setUserData] = useState<UserData>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>();



    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/profile`,{
                    method: "GET",
                    headers:{
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });
                const json = await res.json();
                setUserData(json);
            }catch (error:any) {
                setError(error);
            }finally {
                setLoading(false);
            }
        }
        fetchData();
    },[])
    return {userData, loading, error};
}