import api from './api'

export default {
  getFile(id) {
    return api().get(`files?id=${id}`)
  },
  removeFile(id) {
    return api().delete(`files/${id}`)
  }
}