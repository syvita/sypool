import clarity from '@blockstack/clarity'

const { Client, Provider, Receipt, Result } = clarity

import {
  NotOwnerError,
  TransferError,
} from '../errors.js'

import {
  parse,
  unwrapXYList,
  unwrapSome,
  unwrapOK,
} from '../utils.js'

function buildPrice(price) {
  return `{src: "${price.src}", msg: 0x${price.msg.toString('hex')}, sig: 0x${price.sig.toString('hex')}}`
}

function buildPriceList(prices) {
  return `(list ${prices.map(price => buildPrice(price)).join(' ')})`
}

export class OracleClient extends Client {
  constructor(principal, provider) {
    super(
      `${principal}.oracle`,
      'oracle',
      provider,
    )
  }

  async addPrices(prices, params) {
    console.log("addPrices", buildPriceList(prices))
    const tx = this.createTransaction({
      method: { name: "add-prices", args: [buildPriceList(prices)] }
    })
    await tx.sign(params.sender)
    const receipt = await this.submitTransaction(tx)
    if (receipt.success) {
      // console.log("updatePrice.debugOutput", receipt.debugOutput)
      const result = Result.unwrap(receipt)
      console.log("addPrices.result", result)
      return result.startsWith('Transaction executed and committed. Returned: true')
    }
    console.log("addPrice.receipts", receipt)
  }

  async addPrice(source, msg, signature, params) {
    console.log("addPrice", `0x${msg.toString('hex')}`, `0x${signature.toString('hex')}`)
    const tx = this.createTransaction({
      method: { name: "add-price", args: [`"${source}"`, `0x${msg.toString('hex')}`, `0x${signature.toString('hex')}`] }
    })
    await tx.sign(params.sender)
    const receipt = await this.submitTransaction(tx)
    if (receipt.success) {
      // console.log("updatePrice.debugOutput", receipt.debugOutput)
      const result = Result.unwrap(receipt)
      console.log("addPrice.result", result)
      return result.startsWith('Transaction executed and committed. Returned: true')
    }
    console.log("addPrice.receipt", receipt)
  }

  async addSource(source, public_key, params) {
    const tx = this.createTransaction({
      method: { name: "add-source", args: [`"${source}"`, `0x${public_key.toString('hex')}`] }
    })
    await tx.sign(params.sender)
    const receipt = await this.submitTransaction(tx)
    if (receipt.success) {
      // console.log("updatePrice.debugOutput", receipt.debugOutput)
      const result = Result.unwrap(receipt)
      console.log("addSource.result", result)
      return result.startsWith('Transaction executed and committed. Returned: true')
    }
    // console.log("addSource.receipt", receipt.error.commandOutput)
    if (receipt.error.commandOutput.includes('Aborted: u63')) {
      throw new NotOwnerError()
    }
    throw new NotOKErr()
  }

  async revokeSource(source, params) {
    const tx = this.createTransaction({
      method: { name: "revoke-source", args: [`"${source}"`] }
    })
    await tx.sign(params.sender)
    const receipt = await this.submitTransaction(tx)
    if (receipt.success) {
      // console.log("updatePrice.debugOutput", receipt.debugOutput)
      const result = Result.unwrap(receipt)
      console.log("revokeSource.result", result)
      return result.startsWith('Transaction executed and committed. Returned: true')
    }
    // console.log("revokeSource.receipt", receipt)
    if (receipt.error.commandOutput.includes('Aborted: u63')) {
      throw new NotOwnerError()
    }
    throw new NotOKErr()
  }

  async getPrice(source, symbol) {
    const query = this.createQuery({
      method: {
        name: 'get-price',
        args: [`"${source}"`, `"${symbol}"`],
      },
    })
    const receipt = await this.submitQuery(query)
    return Result.unwrap(receipt)
  }
}
