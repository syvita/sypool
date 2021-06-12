import {
  CONTRACT_NAME,
} from './src/config.js'

import {
  deployContract,
} from './src/clients/oracle-client-tx.js'

await deployContract('oracle', CONTRACT_NAME)
