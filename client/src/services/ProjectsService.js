import api from './api'

export default {
  getData(params) {
    return api().get('projects', {params : {...params}})
  },
  create(params) {
    return api().post(`projects`, {...params})
  },
  approve(id, approve) {
    return api().post('doc/approve', {id, approve})
  },
  update({ id , ...params }) {
    return api().put(`projects/${id}`, {...params})
  },
  remove(id) {
    return api().delete(`projects/${id}`)
  }
}