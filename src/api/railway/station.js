import { axios } from '@/utils/http'
import { buildSearchParms } from '@/utils/apiUtils'

const api = {
  save: '/railwayStations',
  deleteByIds: '/railwayStations',
  findById: '/railwayStations/id/',
  page: '/railwayStations/list'
}

export default api

// id == 0 add     post
// id != 0 update  put
export function save (parameter) {
  return axios({
    url: api.save,
    method: parameter.id === '' ? 'post' : 'put',
    data: parameter
  })
}

export function deleteByIds (parameter) {
  return axios({
    url: api.deleteByIds,
    method: 'delete',
    params: parameter
  })
}

export function findById (parameter) {
  return axios({
    url: api.findById + parameter,
    method: 'get'
  })
}

export function page (pageParam, queryParam) {
  var parm = buildSearchParms(pageParam, queryParam)
  return axios({
    url: api.page,
    method: 'post',
    data: parm
  })
}
