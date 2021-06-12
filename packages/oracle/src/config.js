import dotenv from 'dotenv'

dotenv.config({path: './.env'})

export const COINBASE_KEY = process.env.COINBASE_KEY
export const COINBASE_SECRET = process.env.COINBASE_SECRET
export const COINBASE_PASSPHRASE = process.env.COINBASE_PASSPHRASE

export const INFURA_API_URL = process.env.INFURA_API_URL

export const STACKS_API_URL = process.env.STACKS_API_URL
export const MODE = process.env.MODE

export const ORACLE_SK = process.env.ORACLE_SK
export const ORACLE_PK = process.env.ORACLE_PK
export const ORACLE_STX = process.env.ORACLE_STX

export const CONTRACT_NAME = process.env.CONTRACT_NAME
