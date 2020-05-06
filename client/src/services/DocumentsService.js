import api from './api'

export default {
  getData(params) {
    return api().get('documents', {params : {...params}})
  },
  create(params) {
    return api().post(`documents`, {...params})
  },
  approve(id, approved) {
    return api().post('documents/approve', {id, approved})
  },
  addComment({id, ...params}) {
    return api().post(`comments/${id}/create`, {...params})
  },
  viewed(id) {
    return api().post(`documents/${id}/viewed`)
  },
  update({ id , ...params }) {
    return api().put(`documents/${id}`, {...params})
  },
  remove(id) {
    return api().delete(`documents/${id}`)
  }
}