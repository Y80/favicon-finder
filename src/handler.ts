import page from './page'
import links from './links'
import favicon from './favicon'
import sortIcons from './sortIcons'
import { http } from './http'
import { Icon } from './common'

async function getAllIcons(url: string) {
  const { baseUrl, html } = await page(url)
  // console.log('baseUrl: ', baseUrl)
  // console.log('html: ', html)

  const icons = links(html, baseUrl)
  await favicon(icons, baseUrl)
  if (!icons.length) {
    throw new Error(`获取 ${baseUrl} 网站图标失败，该网站可能没有图标 :(`)
  }

  const sortedIcons = sortIcons(icons)
  return sortedIcons
}

// let url = 'npmjs.com'
// const url = 'http://github.com'
// let url = 'google.com'
// let url = 'openl.club'
// let url = 'wolai.com'
// let url = 'fanyi.baidu.com'
// let url = 'ogden.basic-english.org'
// let url = 'www.iciba.com'
// let url = 'www.deepl.com'
// let url = 'translate.google.cn'
// let url = 'www.cctv.com'
// let url = 'open-notify.org'
// let url = 'bing.com'
// let url = 'www.xiaocongjisuan.com'
// let url = 'api.btstu.cn'
// let url = 'gitee.com'
// let url = 'nav.al'
// let url = 'qq.com'
// let url = '52pojie.cn'
// let url = 'unsplash.com'
// let url = '423down.com'
// let url = 'iao.su'
// let url = 'pipedream.com' // icon 为 Data URI

// getAllIcons(url)

function getPageUrl(pathname: string) {
  const domain = pathname.split('/')[1]
  if (!/^[a-zA-Z\d\-.]+$/.test(domain)) {
    throw new Error('请输入有效的 domain')
  }

  return new URL(`http://${domain}/`).href
}

async function getIconResponse({ src, type }: Icon) {
  const headers = new Headers()
  headers.append('content-type', type)
  // 处理资源为 data uri 的情况
  if (src.startsWith('data:')) {
    type = src.match(/^data:(.+?);/)?.pop() as string
    headers.set('content-type', type)
    const decodedStr = atob(src.split(',').pop() as string)
    const u8Arr = new Uint8Array(decodedStr.length)
    let idx = 0
    while (idx < decodedStr.length) {
      u8Arr[idx] = decodedStr.charCodeAt(idx)
      idx += 1
    }
    headers.append('content-length', decodedStr.length.toString())

    return new Response(new Blob([u8Arr], { type }), { headers })
  }
  const iconRsp = await http.get(src)
  headers.append('x-src', src)
  iconRsp.headers.get('content-type') &&
    headers.set('content-type', iconRsp.headers.get('content-type') as string)
  iconRsp.headers.get('content-length') &&
    headers.append(
      'content-length',
      iconRsp.headers.get('content-length') as string,
    )

  return new Response(await iconRsp.blob(), { headers })
}

export async function handleRequest(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: new Headers({
        'access-control-allow-origin': '*',
        'access-control-allow-method': '*',
      }),
    })
  }

  const url = new URL(request.url)
  if (url.pathname === '/favicon.ico') {
    return fetch('http://apple.com/favicon.ico')
  }

  const headers = new Headers()
  const icons = await getAllIcons(getPageUrl(url.pathname))
  if (url.searchParams.get('json') === 'true') {
    headers.append('content-type', 'application/json')
    return new Response(JSON.stringify(icons), { headers })
  }

  return await getIconResponse(icons[0])
}
