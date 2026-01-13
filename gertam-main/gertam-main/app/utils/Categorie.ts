export async  function getAllCategories() {


        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/allSections`);
        const json = await res.json();
        return json;

}