export enum ICON_TYPE {
  '.ico' = 'image/x-icon',
  '.png' = 'image/png',
  '.gif' = 'image/gif',
  '.svg' = 'image/svg+xml',
}

export const iconTypeMap = [
  { extension: '.ico', type: 'image/x-icon' },
  { extension: '.png', type: 'image/png' },
  { extension: '.svg', type: 'image/svg+xml' },
  { extension: '.gif', type: 'image/gif' },
]

export interface Icon {
  src: string
  type: string
  // eg: '16x16' '64x64' '128x128'...
  sizes?: string
}
