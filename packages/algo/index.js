import { Router } from 'itty-router'
import { updatePrice } from './src/updatePrice'

// Create a new router
const router = Router()

router.get("/", () => {
  return new Response("Hello, world! This is the root page of your Worker template.")
})

router.get("/example/:text", ({ params }) => {
  // Decode text like "Hello%20world" into "Hello world"
  let input = decodeURIComponent(params.text)

  // Construct a buffer from our input
  let buffer = Buffer.from(input, "utf8")

  // Serialise the buffer into a base64 string
  let base64 = buffer.toString("base64")

  // Return the HTML with the string to the client
  return new Response(`<p>Base64 encoding: <code>${base64}</code></p>`, {
    headers: {
      "Content-Type": "text/html"
    }
  })
})

router.all("*", () => new Response("404, not found!", { status: 404 }))

async function handleScheduled(event) {
  cron = event.cron

  if (cron == '* * * * *') {
    // we need to get the latest stx/btc price and add to this month's avg
    const now = new Date()
    const key = now.getMonth() + '-' + now.getFullYear()
    const value = await KV.get(key)

    if (value == null) {
      const newMonth = {
        price: {
          currentAvg: 0,
          count: 0,
          allPrices: []
        }
      }
      updatePrice(key, newMonth)
    } else {
      updatePrice(key, value)
    }

  } else if (cron == '*/10 * * * *') {
    // we need to get latest mining

  } else if (cron == '') {
    // we need to publish latest cycle targets to contract
  }
}

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})

addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled(event))
})