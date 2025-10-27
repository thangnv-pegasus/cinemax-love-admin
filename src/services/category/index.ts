import http from "@/config/axios"

export const getCategories = async () => {
  try {
    const res = await http.get('/categories/list')

    return res.data;
  } catch (err) {
    console.error('>>> err >>> ', err)
    return []
  }
}

export const getCategoriesPagination = async (page = 1, limit = 12, search = '') => {
  try {
    const res = await http.get(`categories?page=${page}&limit=${limit}&search=${search}`)

    return res.data
  } catch (err) {
    console.error('>>> list categories err >>> ', err)

    return {
      data: [],
      meta: {
        page: 1,
        last_page: 1,
        total: 1,
      }
    }
  }
}

export const deleteCategory = async (id: number) => {
  try {
    const res = await http.delete(`categories/${id}`)

    return res.data
  } catch (err) {
    return null;
  }
}

export const updateCategory = async (id: number, payload: any) => {
  try {
    const res = await http.patch(`categories/${id}`, payload)

    return res.data
  } catch (err) {
    console.log('>>> update category err >>> ', err)

    return null;
  }
}

export const createCategory = async (payload: any) => {
  try {
    const res = await http.post('categories', payload)

    return res.data
  }catch(err) {
    console.log('>>> create category err >>> ', err)
    return null;
  }
}