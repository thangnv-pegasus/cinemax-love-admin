import http from "@/config/axios"

export const getFilmPagination = async (page = 1, limit = 10, search = '') => {
  try {
    const res = await http.get(`films?page=${page}&limit=${limit}&search=${search}`)

    return res.data
  } catch (err) {
    console.error('>>> films err >>> ', err)

    return []
  }
}

export const postNewFilm = async (payload: any) => {
  try {
    const res = await http.post('films', payload, {
      headers: {
        "Content-Type": 'multipart/form-data'
      }
    })

    return res.data
  } catch (err) {
    console.error('>>> upload film err >>> ', err)
    return err;
  }
}

export const updateFilm = async (filmId: number, payload: any) => {
  try { 
    const res = await http.patch(`films/${filmId}`, payload, {
      headers: {
        "Content-Type": 'multipart/form-data'
      }
    })

    return res.data
  }catch(err) {
    console.error('>>> update film >>> ', err)

    return null;
  }
}

export const deleteFilm = async (filmId: number) => {
  try {
    const res = await http.delete(`films/${filmId}`)

    return res.data
  }catch(err) {
    return false;
  }
}