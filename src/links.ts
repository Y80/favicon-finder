// 从HTML中解析所有 rel 包含 icon 的标签

import { Icon, iconTypeMap, ICON_TYPE } from './common'

function getType(link: string, iconSrc: string) {
  if (/type="(.+?)"/i.test(link)) return RegExp.$1

  for (let idx = 0; idx < iconTypeMap.length; idx++) {
    const { extension, type } = iconTypeMap[idx]
    if (iconSrc.includes(extension)) return type
  }

  return ICON_TYPE['.ico']
}

function getSizes(link: string, iconsSrc: string) {
  if (/sizes="(.+?)"/i.test(link)) return RegExp.$1

  // 尝试从图标地址中找到尺寸
  if (/[^\da-zA-Z](\d{2,3}[xX*\-_/]\d{2,3})[^\da-zA-Z]/.test(iconsSrc))
    return RegExp.$1
  if (/[\W_](\d{2,3})[\W_]/.test(iconsSrc)) return `${RegExp.$1}x${RegExp.$1}`
}

export default function links(html: string, baseUrl: string): Icon[] {
  const linkTags = html.match(/<link.+?>/gi)
  if (!linkTags) return []

  const icons: Icon[] = []
  linkTags.forEach((linkTag) => {
    // 当前 link 标签的 rel 值不包含 icon
    if (!/rel="[ \w-]*?icon[ \w-]*?"/gi.test(linkTag)) return
    console.log(linkTag)
    // 当前 link 标签的 href 值不是有效值
    if (!/href="(.{2,}?)"/i.test(linkTag)) return
    const src = RegExp.$1
    // 图标出现重复
    if (icons.map((icon) => icon.src).includes(src)) return

    icons.push({
      src: new URL(src, baseUrl).href,
      type: getType(linkTag, src),
      sizes: getSizes(linkTag, src),
    })
  })

  return icons
}
