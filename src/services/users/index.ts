import http from "@/config/axios";

export const getMe = async () => {
  try {
    const res = await http.get('/users/me')

    return res;
  }catch(err) {
    return err;
  }
}

export const getUsers = async (page = 1, limit = 12, search = '') => {
  try {
    const res = await http.get(`/users?page=${page}&limit=${limit}&search=${search}`)

    return res.data
  }catch(err) {
    console.error('>>> users error >>> ', err)

    return []
  }
}

export const updateUser = async (userId: number, payload: any) => {
  try {
    const res = await http.patch(`/users/${userId}`, {
      name: payload.name,
      email: payload.email,
      role: +payload.role
    }, {
      method: 'PATCH'
    })

    return res.data;
  }catch(err) {
    console.error('>>> update user error >> ', err)

    return err;
  }
}

export const deleteUser = async (userId: number ) => {
  try {
    const res = await http.delete(`/users/${userId}`)

    return res.data;
  }catch(err) {
    console.error('>>> delete user >>> ', err)

    return err;
  }
}

export const createUser = async (payload: any) => {
  try {
    const res = await http.post('/users', payload, {
      method: 'POST'
    })

    return res.data;
  }catch(err) {
    console.error('>>> create user >>> ', err)

    return err;
  }
}

