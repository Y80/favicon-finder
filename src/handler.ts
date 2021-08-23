import page from './page'
import links from './links'
import favicon from './favicon'
import sortIcons from './sortIcons'
import { http } from './http'

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

// getAllIcons(url)

function getPageUrl(pathname: string) {
  const domain = pathname.split('/')[1]
  if (!/^[a-zA-Z\d\-.]+$/.test(domain)) {
    throw new Error('请输入有效的 domain')
  }

  return new URL(`http://${domain}/`).href
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

  const targetIcon = icons[0]
  const iconRsp = await http.get(targetIcon.src)
  headers.append('x-src', targetIcon.src)
  headers.append(
    'content-type',
    iconRsp.headers.get('content-type') || targetIcon.type,
  )
  const contentLength = iconRsp.headers.get('content-length')
  if (contentLength) {
    headers.set('content-length', contentLength)
  }

  return new Response(await iconRsp.blob(), { headers })
}
