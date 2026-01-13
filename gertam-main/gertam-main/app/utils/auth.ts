

export async function getUser (){
    try {
        const token = localStorage.getItem("token"); // أو cookies إذا خزنتها هناك

        if (!token) {
            return null;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/profile`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        return data;
    } catch (err) {
    }
}

export async function logoutUser(token: string) {
    try {
         await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // ضروري
            },
        });


        localStorage.removeItem("token");
        return ;

    } catch (error) {
        throw error;
    }
}
