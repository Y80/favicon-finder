import { Icon } from './common'

export default function sortIcons(icons: Icon[], expectedSize = 32) {
  let sortedIcons: Icon[] = []

  icons.sort((preIcon, curIcon) => {
    if (!/(\d{2,3})/.test(preIcon.sizes || '')) return 0
    const preIconSize = Number(RegExp.$1)
    if (!/(\d{2,3})/.test(curIcon.sizes || '')) return 0
    const curIconSize = Number(RegExp.$1)

    return Math.abs(preIconSize - expectedSize) - Math.abs(curIconSize - expectedSize)
  })
  ;['svg', 'png', 'ico', 'gif'].forEach((type) => {
    sortedIcons = sortedIcons.concat(icons.filter((item) => item.type.includes(type)))
  })

  const srcList = sortedIcons.map((icon) => icon.src)
  sortedIcons = sortedIcons.concat(icons.filter((icon) => !srcList.includes(icon.src)))

  return sortedIcons
}
