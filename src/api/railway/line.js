import { axios } from '@/utils/http'
import { buildSearchParms } from '@/utils/apiUtils'

const api = {
  save: '/railwayLines',
  deleteByIds: '/railwayLines',
  findById: '/railwayLines/id/',
  page: '/railwayLines/list'
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
    data: parameter
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

// /**
//  * 构建查询语句
//  * @param {*} 分页参数
//  * @param {*} 条件参数
//  */
// function condQuery (pageParam, queryParam) {
//   const data = {}
//   const searchParams = []

//   data.page = pageParam.pageNo
//   data.size = pageParam.pageSize
//   data.searchParams = searchParams

//   for (var key in queryParam) {
//     const params = key.split('__')
//     let value = queryParam[key]
//     let value1 = ''

//     if (params.length === 3) {
//       if (params[2] === 'value1') {
//         value = ''
//         value1 = queryParam[key]
//       }
//     }

//     searchParams.push({
//       'fieldName': params[0],
//       'operator': params[1],
//       'value': value,
//       'value1': value1
//     })
//   }

//   return data
// }
