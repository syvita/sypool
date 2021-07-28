import Web3 from 'web3'
// Show web3 where it needs to look for the Ethereum node.
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/1f045ee60e7f4baaa193efd984f69577'))

import { INFURA_API_URL } from './config.js'

// 0000000000000000000000000000000000000000000000000000000000000080  offset `prices`    (constant)
// 00000000000000000000000000000000000000000000000000000000604bf84c  timestamp
// 00000000000000000000000000000000000000000000000000000000000000c0  offset symol       (constant)
// 0000000000000000000000000000000000000000000000000000000d5b97cd50  amount
// 0000000000000000000000000000000000000000000000000000000000000006  length of 'prices' (constant)
// 7072696365730000000000000000000000000000000000000000000000000000  'prices'           (constant)
// 0000000000000000000000000000000000000000000000000000000000000003  length of 'symbol'
// 4254430000000000000000000000000000000000000000000000000000000000  symbol

export function buildPayload(timestamp, symbol, price) {
  // console.log("buildPayload", timestamp, symbol, price, timestamp.toString(16), price.toString(16))

  // prefill as much, and add timestamp, price and symbol
  const timestamp_offset = 64 - 8  // 64 bits?
  const price_offset = 128 - 8  // 64 bits?
  const symbol_length_offset = 223  // 1 byte
  const symbol_string_offset = 224

  const buffer = Buffer.from('0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006707269636573000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex')
  buffer.writeBigInt64BE(BigInt(timestamp), timestamp_offset)
  buffer.writeBigInt64BE(BigInt(price), price_offset)

  buffer.writeInt8(symbol.length, symbol_length_offset)
  const symbol_buffer = Buffer.from(symbol, 'latin1')
  // console.log("symbol_buffer", symbol_buffer.toString('hex'))
  symbol_buffer.copy(buffer, symbol_string_offset)

  return buffer
}

export function signPayload(msg, secret_key) {

  // console.log("=====> signPayload", msg, secret_key)

  // signature is 96 bytes (check is either 1b or 1c, but on 32 bytes)
  const buffer = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex')

  const r_offset = 0
  const s_offset = 32
  const v_offset_src = 0
  const v_offset_dest = 64

  // console.log("signing", `0x${msg.toString('hex')}`, `0x${secret_key}`)

  const hash = web3.utils.keccak256(`0x${msg.toString('hex')}`);
  const signed = web3.eth.accounts.sign(hash, `0x${secret_key.slice(0, 64)}`)  // remove compression byte

  const r_buffer = Buffer.from(signed.r.slice(2), 'hex')
  const s_buffer = Buffer.from(signed.s.slice(2), 'hex')
  const v_buffer = Buffer.from(signed.v.slice(2), 'hex')

  // console.log("v_buffer", v_buffer.toString('hex'), v_buffer.length)
  const verification_byte = v_buffer.readInt8(v_offset_src)
  // console.log("verification_byte", verification_byte)

  r_buffer.copy(buffer, r_offset)
  s_buffer.copy(buffer, s_offset)
  // adjust 32 bytes to stacks compatible signature with 0x1b => 0, 0x1c => 1
  if (verification_byte === 0x1b) {
    buffer.writeInt8(0x00, v_offset_dest)
  } else {
    buffer.writeInt8(0x01, v_offset_dest)
  }

  // console.log(signed)
  // console.log("signature", buffer.toString('hex'))
  return buffer
}

export function convertSig(sig) {
  const buffer = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex')
  const sig_buffer = Buffer.from(sig.slice(2), 'hex')

  sig_buffer.copy(buffer, 0, 0, 64)

  const v_offset_dest = 64
  const v_offset_src = 95
  const verification_byte = sig_buffer.readInt8(v_offset_src)
  if (verification_byte === 0x1b) {
    buffer.writeInt8(0x00, v_offset_dest)
  } else {
    buffer.writeInt8(0x01, v_offset_dest)
  }
  return buffer
}