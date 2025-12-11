import http from "@/config/axios"

export const getComments = async (page: number, limit: number, search = '') => {
  try {
    const res = await http.get('episode-comment', {
      params: {
        page,
        limit,
        search
      }
    })
    return res.data
  } catch (err) {
    console.error('>>> getComments err >>> ', err)
    throw err
  }
}

export const deleteComment = async (id: number) => {
  try {
    const res = await http.delete(`episode-comment/${id}`)
    return res.data
  } catch (err) {
    console.error('>>> deleteComment err >>> ', err)
    throw err
  }
}

export const updateComment = async (id: number, data: any) => {
  try {
    const res = await http.patch(`episode-comment/${id}`, data)
    return res.data
  } catch (err) {
    console.error('>>> updateComment err >>> ', err)
    throw err
  } 
}