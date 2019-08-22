// 构建查询条件参数
export function buildSearchParms (pageParam, queryParam) {
  const data = {}
  const searchParams = []

  data.page = pageParam.pageNo
  data.size = pageParam.pageSize
  data.searchParams = searchParams

  // 排序
  if (!(typeof (pageParam.sortField) === 'undefined')) {
    const sortField = pageParam.sortField
    const sortOrder = pageParam.sortOrder

    data.field = sortField
    if (sortOrder === 'ascend') {
      data.order = 'asc'
    } else {
      data.order = 'desc'
    }
  }

  for (var key in queryParam) {
    const params = key.split('__')
    let value = queryParam[key]
    let value1 = ''

    if (params.length === 3) {
      if (params[2] === 'value1') {
        value = ''
        value1 = queryParam[key]
      }
    }

    searchParams.push({
      'fieldName': params[0],
      'operator': params[1],
      'value': value,
      'value1': value1
    })
  }

  return data
}
