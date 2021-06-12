import BigNum from 'bn.js'
import fs from "fs"
import fetch from 'node-fetch'
import {
  ClarityType,

  bufferCV,
  listCV,
  tupleCV,
  stringAsciiCV,

  deserializeCV,
  serializeCV,

  broadcastTransaction,
  makeContractCall,
  makeContractDeploy,

  PostConditionMode,
} from "@stacks/transactions"

import {
  StacksMainnet,
  StacksTestnet,
  StacksMocknet,
} from '@stacks/network'

import {
  processing,
} from '../tx-utils.js'
import {
  CONTRACT_NAME,
  MODE,
  ORACLE_PK,
  ORACLE_SK,
  ORACLE_STX,
  STACKS_API_URL,
} from '../config.js'

const network = MODE === 'mainnet' ? new StacksMainnet() : MODE === 'testnet' ? new StacksTestnet() : new StacksMocknet()
network.coreApiUrl = STACKS_API_URL  // Is this needed except in case of custom node?

console.log("=========================================================")
console.log("mode", MODE)
console.log("api", STACKS_API_URL)
console.log("=========================================================")

export async function deployContract(contract_file) {
  console.log(`deploying ${CONTRACT_NAME}`, ORACLE_PK, ORACLE_STX)
  const body = fs.readFileSync(`./contracts/${contract_file}.clar`).toString()
  const codeBody = body
    .replaceAll('0367b2946150dfab1862457da80beb522440be5737ea51ba14cf8018a12911128f', ORACLE_PK)
    .replaceAll('ST31HHVBKYCYQQJ5AQ25ZHA6W2A548ZADDQ6S16GP', ORACLE_STX)

  const transaction = await makeContractDeploy({
    contractName: CONTRACT_NAME,
    codeBody,
    senderKey: ORACLE_SK,
    network,
  })

  const result = await broadcastTransaction(transaction, network)
  if (result.error) {
    if (result.reason === "ContractAlreadyExists") {
      console.log(`${CONTRACT_NAME} already deployed`)
      return result
    } else {
      throw new Error(
        `failed to deploy ${CONTRACT_NAME}: ${JSON.stringify(result)}`
      )
    }
  }
  const processed = await processing(result, 0, 25)
  if (!processed) {
    throw new Error(`failed to deploy ${CONTRACT_NAME}: transaction not found`)
  }
  return result
}

function buildPrice(price) {
  return tupleCV({
    src: stringAsciiCV(price.src),
    msg: bufferCV(price.msg),
    sig: bufferCV(price.sig),
  })
}

function buildPriceList(prices) {
  return listCV(prices.map(price => buildPrice(price)))
}

export async function addPrices(prices, options) {
  // console.log("addPrices", contract_name /*, prices*/)
  const transaction = await makeContractCall({
    contractAddress: ORACLE_STX,
    contractName: CONTRACT_NAME,
    functionName: 'add-prices',
    functionArgs: [buildPriceList(prices)],
    senderKey: ORACLE_SK,
    network,
    // helpful to recover botched tx, overbig...
    // nonce: new BigNum(1),
    // fee: new BigNum(20000),
    nonce: options.nonce ? new BigNum(options.nonce) : undefined,
    postConditionMode: PostConditionMode.Allow,
    postConditions: [
    ],
  })
  // console.log("transaction", transaction.payload)
  const serialized = transaction.serialize().toString('hex')
  console.log("serialized", serialized, serialized.length)

  const result = await broadcastTransaction(transaction, network)
  console.log("result", result)
  if (result.error) {
    console.log(result.reason)
    throw new Error(`transaction failed`)
  }
  return result
}

export async function getPrice(source, symbol) {
  // console.log("getPrice", source, symbol)
  const function_name = 'get-price'

  const sourceCV = serializeCV(stringAsciiCV(source))
  const symbolCV = serializeCV(stringAsciiCV(symbol))

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"sender":"${ORACLE_STX}","arguments":["0x${sourceCV.toString("hex")}","0x${symbolCV.toString("hex")}"]}`,
  }
  // console.log("body", options.body)
  const response = await fetch(`${STACKS_API_URL}/v2/contracts/call-read/${ORACLE_STX}/${CONTRACT_NAME}/${function_name}`, options)

  if (response.ok) {
    const result = await response.json()
    if (result.okay) {
      const result_value = deserializeCV(Buffer.from(result.result.substr(2), "hex"))
      // console.log("result_value", result_value)
      // console.log("result_value", result_value.value.data)
      if (result_value.type === ClarityType.OptionalSome) {
        return {
          amount: result_value.value.data.amount.value.toString(),  // TODO(psq): need decimal information to use toNumber() to avoid overflow (thanks ETH)
          height: result_value.value.data.height.value.toNumber(),
          timestamp: result_value.value.data.timestamp.value.toNumber(),
        }
      } else {
        return null
      }

      return result_data.value.value
    } else {
      console.log(result)
    }
  } else {
    console.log("not 200 response", response)
  }
}

export async function addSource(source, key) {
  const transaction = await makeContractCall({
    contractAddress: ORACLE_STX,
    contractName: CONTRACT_NAME,
    functionName: 'add-source',
    functionArgs: [stringAsciiCV(source), bufferCV(Buffer.from(key.slice(2), 'hex'))],
    senderKey: ORACLE_SK,
    network,
    postConditionMode: PostConditionMode.Allow,
    postConditions: [
    ],
  })
  // console.log("transaction", transaction.payload)
  const serialized = transaction.serialize().toString('hex')
  console.log("serialized", serialized, serialized.length)

  const result = await broadcastTransaction(transaction, network)
  console.log("result", result)
  if (result.error) {
    console.log(result.reason)
    throw new Error(`transaction failed`)
  }
  const processed = await processing(result, 0, 25)
  if (!processed) {
    throw new Error(`failed to execute add-prices`)
  }
}

export async function revokeSource(source) {
  const transaction = await makeContractCall({
    contractAddress: ORACLE_STX,
    contractName: CONTRACT_NAME,
    functionName: 'revoke-source',
    functionArgs: [stringAsciiCV(source)],
    senderKey: ORACLE_SK,
    network,
    postConditionMode: PostConditionMode.Allow,
    postConditions: [
    ],
  })
  // console.log("transaction", transaction.payload)
  const serialized = transaction.serialize().toString('hex')
  console.log("serialized", serialized, serialized.length)

  const result = await broadcastTransaction(transaction, network)
  console.log("result", result)
  if (result.error) {
    console.log(result.reason)
    throw new Error(`transaction failed`)
  }
  const processed = await processing(result, 0, 25)
  if (!processed) {
    throw new Error(`failed to execute add-prices`)
  }
}

export async function checkSource(source) {
  const function_name = 'check-source'

  const sourceCV = serializeCV(stringAsciiCV(source))

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"sender":"${ORACLE_STX}","arguments":["0x${sourceCV.toString("hex")}"]}`,
  }
  // console.log("body", options.body)
  const response = await fetch(`${STACKS_API_URL}/v2/contracts/call-read/${ORACLE_STX}/${CONTRACT_NAME}/${function_name}`, options)

  if (response.ok) {
    const result = await response.json()
    if (result.okay) {
      const result_value = deserializeCV(Buffer.from(result.result.substr(2), "hex"))
      // console.log("result_value", result_value)
      // console.log("result_value", result_value.value.data)
      if (result_value.type === ClarityType.OptionalSome) {
        return `0x${result_value.value.data['public-key'].buffer.toString('hex')}`
      } else {
        return null
      }

      return result_data.value.value
    } else {
      console.log(result)
    }
  } else {
    console.log("not 200 response", response)
  }
}
