import { http } from './http'

export default async function page(
  url: string,
): Promise<{ baseUrl: string; html: string }> {
  const rsp = await http.get(url)

  return {
    // （经过重定向的最终的）请求地址
    baseUrl: rsp.url,
    html: await rsp.text(),
  }
}
