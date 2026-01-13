//
//
//
// export async function getFavorites() {
//     const token = localStorage.getItem('token');
//     if (!token) return null;
//     const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/favorites`, {
//         method: "GET",
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//         },
//     });
//
//     // if (!res.ok) throw new Error(res.statusText);
//     if (!res.ok) return null;
//
//     const data = await res.json();
//
//     // تأكد من أن data مصفوفة قبل الإرجاع
//     return Array.isArray(data) ? data : [];
// }
//
//
// export async function addFavorite(product_id: number) {
//     const token = localStorage.getItem('token');
//     if (!token) return null;
//     const res  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/favorites/${product_id}`, {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//         }
//     });
//     const data = await res.json();
//     return data;
// }
//
// export async function chekFavorite(product_id: number) {
//
// }