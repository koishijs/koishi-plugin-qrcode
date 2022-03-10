import { Context, Schema, segment } from 'koishi'
import { toDataURL } from 'qrcode'

export interface Config {}

export const name = 'QRCode'
export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.i18n.define('zh', require('./locales/zh'))

  ctx.command('qrcode <text:text>')
    .option('margin', '-m <margin>', { fallback: 4 })
    .option('scale', '-s <scale>', { fallback: 4 })
    .option('width', '-w <width>')
    .option('dark', '-d <color>')
    .option('light', '-l <color>')
    .action(async ({ options, session }, text) => {
      if (!text) return session.text('.expect-text')
      if (text.includes('[CQ:')) return session.text('.invalid-segment')

      const { margin, scale, width, dark, light } = options
      const dataURL = await toDataURL(text, { margin, scale, width, color: { dark, light } })
      // data:image/png;base64,
      return segment.image('base64://' + dataURL.slice(22))
    })
}
