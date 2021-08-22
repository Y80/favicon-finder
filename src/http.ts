const headers = new Headers({
  accept: '*/*',
  'accept-language': 'zh,en;q=0.9,zh-CN;q=0.8',
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36',
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

http.get = (url: string) => fetch(url)
http.head = (url: string) => fetch(url, { method: 'HEAD' })
