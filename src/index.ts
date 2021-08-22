import { handleRequest } from './handler'

async function responseWrapper(response: Response | Promise<Response>) {
  let rsp
  if (response instanceof Promise) {
    try {
      rsp = await response
    } catch (error) {
      rsp = new Response(`应用出现错误：${error.message}`, { status: 500 })
    }
  } else {
    rsp = response
  }
  const headers = new Headers({ 'access-control-allow-origin': '*' })
  rsp.headers.forEach((value, key) => {
    headers.set(key, value)
  })

  return new Response(rsp.body, { headers })
}

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(responseWrapper(handleRequest(event.request)))
})
