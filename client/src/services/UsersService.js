import api from './api'

export default {
  getData(params) {
    return api().get('users', {params : {...params}})
  },
  create(params) {
    return api().post(`users`, {...params})
  },
  update({ id , ...params }) {
    return api().put(`users/${id}`, {...params})
  },
  remove(id) {
    return api().delete(`users/${id}`)
  },
  getAllProjects() {
    return api().get(`projects/all`)
  },
  getUserProjects(id) {
    return api().get(`projects/all?userId=${id}`)
  }
}