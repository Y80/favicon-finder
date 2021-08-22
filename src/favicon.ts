import { Icon, ICON_TYPE } from './common'
import { http } from './http'

// 尝试直接访问根目录下的 /favicon.ico
export default async function favicon(icons: Icon[], baseUrl: string) {
  if (icons.length) return
  // 避免重复添加 favicon.ico
  const srcList = icons.map((icon) => icon.src)
  for (let idx = 0; idx < srcList.length; idx++) {
    if (/\/favicon\.ico/.test(srcList[idx])) return
  }
  const url = new URL('/favicon.ico', baseUrl).href
  try {
    const rsp = await http.head(url)
    if (rsp.status === 200)
      icons.push({
        src: url,
        type: ICON_TYPE['.ico'],
      })
  } finally {
  }
}
