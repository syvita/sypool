export async function updatePrice(key, value) {
    const parsedValue = JSON.parse(value)
  
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=btc'
    const init = {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
    const response = await fetch(url, init)
    const result = await response.json()
    const currentPrice = result.blockstack.btc * 100000000
  
    const newAvg = (currentPrice / 43830) + parsedValue.averagePrice
    let newValue = parsedValue
  
    newValue.price.currentAvg = newAvg
    newValue.price.count++
    newValue.price.allPrices.push(currentPrice)
  
    newValue = JSON.stringify(newValue)
    await KV.put(key, newValue, {
      metadata: {
        currentAvg: newAvg,
        count: newValue.price.count
      }
    })
  }