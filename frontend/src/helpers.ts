import qs from 'qs'

export const getDataFromQueryParams = (key: string, queryParams: string) => {
  const parsedQueryParams = qs.parse(queryParams, {
    ignoreQueryPrefix: true
  })

  if (typeof parsedQueryParams[key] === 'string') {
    return JSON.parse(parsedQueryParams[key])
  }

  return undefined
}
