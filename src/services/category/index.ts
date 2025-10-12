import http from "@/config/axios"

export const getCategories = async () => {
  try {
    const res = await http.get('/categories/list')

    return res.data;
  }catch(err) {
    console.error('>>> err >>> ', err)
    return []
  }
}