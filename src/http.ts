const headers = new Headers({
  accept: '*/*',
  'accept-language': 'zh,en;q=0.9,zh-CN;q=0.8',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
})

const defaultOptions: RequestInit = {
  headers,
  redirect: 'follow',
  method: 'GET',
}

export function http(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(url, { ...defaultOptions, ...options })
}

http.get = (url: string) => http(url)
http.head = (url: string) => http(url, { method: 'HEAD' })
