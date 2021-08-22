import { Icon } from './common'
import { http } from './http'

export default async function fetchIconInfo(src: string): Promise<Icon | null> {
  try {
    // 使用 head 方法虽然可以减少请求时间，但是有些资源，head 请求和 get 请求返回的 headers 不一致
    // const { headers } = await got.head(src)
    const { headers } = await http.get(src)
    const rst = {
      src,
      // ⚠️ response headers 中 content-length 和 content-type 并非一定存在
      length: Number(headers.get('content-length')) || 0,
      type: headers.get('content-type') || '',
    }
    if (!rst.length || !rst.type) return null
    return rst
  } catch (error) {
    return null
  }
}
