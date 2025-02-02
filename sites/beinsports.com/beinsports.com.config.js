const axios = require('axios')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

module.exports = {
  site: 'beinsports.com',
  days: 2,
  request: {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
    }
  },
  url: function ({ date, channel }) {
    return `https://www.beinsports.com/api/opta/tv-event?&startBefore=${date.add(1, 'd').format(
    "YYYY-MM-DDTHH:mm:ss.SSS")}Z&endAfter=${date.format(
    "YYYY-MM-DDTHH:mm:ss.SSS")}Z&channelIds=${channel.site_id}`
  },
  parser: function ({ content }) {
    let programs = []
    const items = parseItems(content)
    if (!items.length == 0) {
      items.forEach(item => {
        const start = dayjs.utc(item.startDate)
        const stop = dayjs.utc(item.endDate)
        programs.push({
          title: item.title,
          description: item.description,
          start,
          stop
        })
      })
    }
    return programs
  }
}

function parseItems(content) {
  const data = JSON.parse(content)
  if (data.length === 0) {
    return []
  }
  return data['rows']
}
