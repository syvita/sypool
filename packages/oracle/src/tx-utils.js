import {
  ORACLE_STX,
  STACKS_API_URL,
} from './config.js'

export async function processing(tx, count, max) {
  console.log("processing", tx, count)
  const result = await fetch(
    `${STACKS_API_URL}/extended/v1/tx/${tx}`
  )
  const value = await result.json()
  if (value.tx_status === "success") {
    console.log(`transaction ${tx} processed`)
    // console.log(value)
    return true
  }
  // if (value.tx_status === "pending") {
  //   console.log("pending" /*, value*/)
  // }
  if (count > max) {
    console.log(`failed after ${max} attempts`, value)
    return false
  }

  await timeout(30000)
  return processing(tx, count + 1, max)
}

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getNonce() {
  console.log("getNonce for", ORACLE_STX)
  const result = await fetch(
    `${STACKS_API_URL}/v2/accounts/${ORACLE_STX}?proof=0`
  )
  const value = await result.json()
  // console.log("value", value)
  return value.nonce
}