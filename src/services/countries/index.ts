import http from "@/config/axios"

export const getAllCountries = async () => {
  try {
    const res = await http.get('countries/all')

    return res.data
  }catch(err) {
    console.error('>>> countries err >>> ', err)

    return []
  }
}