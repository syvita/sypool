/**
 * RPC agent, based on bitcore's RpcClient.
 */

const http = require('http');
const https = require('https');
var fs = require('fs');

/**
 * Source: https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_calls_list
 * @type {Object}
 */
const BC_RPC = {
  abandonTransaction: [],
  abortRescan: [],
  addMultiSigAddress: [],
  addNode: [],
  analyzePSBT: [],
  backupWallet: [],
  bumpFee: [],
  clearBanned: [],
  combinePSBT: [],
  combineRawTransaction: [],
  convertToPSBT: [],
  createMultiSig: [],
  createPSBT: [],
  createRawTransaction: [],
  createWallet: [],
  decodePSBT: [],
  decodeRawTransaction: [],
  decodeScript: [],
  deriveAddresses: [],
  disconnectNode: [],
  dumpPrivKey: [],
  dumpWallet: [],
  encryptWallet: [],
  estimateSmartFee: [],
  finalizePSBT: [],
  fundRawTransaction: [],
  generateToAddress: [],
  getAddedNodeInfo: [],
  getAddressesByLabel: [],
  getAddressInfo: [],
  getBalance: [],
  getBestBlockHash: [],
  getBlock: [],
  getBlockChainInfo: [],
  getBlockCount: [],
  getBlockHash: [],
  getBlockHeader: [],
  getBlockStats: [],
  getBlockTemplate: [],
  getChainTips: [],
  getChainTxStats: [],
  getConnectionCount: [],
  getDescriptorInfo: [],
  getDifficulty: [],
  getMemoryInfo: [],
  getMempoolAncestors: [],
  getMempoolDescendants: [],
  getMempoolEntry: [],
  getMempoolInfo: [],
  getMiningInfo: [],
  getNetTotals: [],
  getNetworkHashPS: [],
  getNetworkInfo: [],
  getNewAddress: [],
  getNodeAddresses: [],
  getPeerInfo: [],
  getRawChangeAddress: [],
  getRawMempool: [],
  getRawTransaction: [],
  getReceivedByAddress: [],
  getReceivedByLabel: [],
  getRPCInfo: [],
  getTransaction: [],
  getTxOut: [],
  getTxOutProof: [],
  getTxOutSetInfo: [],
  getUnconfirmedBalance: [],
  getWalletInfo: [],
  getZMQNotifications: [],
  help: [],
  importAddress: [],
  importMulti: [],
  importPrivKey: [],
  importPrunedFunds: [],
  importPubKey: [],
  importWallet: [],
  joinPSBTs: [],
  invalidateBlock: [],
  keyPoolRefill: [],
  listAddressGroupings: [],
  listBanned: [],
  listLabels: [],
  listLockUnspent: [],
  listReceivedByAddress: [],
  listReceivedByLabel: [],
  listSinceBlock: [],
  listTransactions: [],
  listUnspent: [],
  listWalletDir: [],
  listWallets: [],
  loadWallet: [],
  lockUnspent: [],
  logging: [],
  ping: [],
  preciousBlock: [],
  prioritiseTransaction: [],
  pruneBlockChain: [],
  removePrunedFunds: [],
  rescanBlockChain: [],
  saveMempool: [],
  scanTxOutSet: [],
  sendMany: [],
  sendRawTransaction: [],
  sendToAddress: [],
  setBan: [],
  setTxFee: [],
  signMessage: [],
  signMessageWithPrivKey: [],
  signRawTransactionWithKey: [],
  signRawTransactionWithWallet: [],
  stop: [],
  submitBlock: [],
  submitHeader: [],
  testMempoolAccept: [],
  unloadWallet: [],
  uptime: [],
  utxoUpdatePSBT: [],
  validateAddress: [],
  verifyChain: [],
  verifyMessage: [],
  verifyTxOutProof: [],
  walletCreateFundedPSBT: [],
  walletLock: [],
  walletPassPhrase: [],
  walletPassphraseChange: [],
  walletProcessPSBT: [],

  // Elements only
  blindPSBT: [],
  blindRawTransaction: [],
  blindRawTransaction: [],
  claimPegIn: [],
  combineBlockSigs: [],
  consumeCompactSketch: [],
  consumeGetBlockTxn: [],
  createBlindedAddress: [],
  createRawPegin: [],
  destroyAmount: [],
  dumpAssetLabels: [],
  dumpBlindingKey: [],
  dumpIssuanceBlindingKey: [],
  dumpMasterBlindingKey: [],
  finalizeCompacBblock: [],
  getCompactSketch: [],
  getNewBlockHex: [],
  getPAKInfo: [],
  getPegInAddress: [],
  getSidechainInfo: [],
  getWalletPAKInfo: [],
  importBlindingKey: [],
  importBlindingKey: [],
  importIssuanceBlindingKey: [],
  initPegOutWallet: [],
  issueAsset: [],
  listIssuances: [],
  rawBlindRawTransaction: [],
  rawIssueAsset: [],
  rawReissueAsset: [],
  reissueAsset: [],
  sendToMainChain: [],
  signBlock: [],
  testProposedBlock: [],
  tweakFedPegScript: [],
  unblindRawTransaction: [],
};

const slice = (arr, start, end) => Array.prototype.slice.call(arr, start, end);

function rpcClient (opts = {}) {
  this.host = opts.host || '127.0.0.1';
  this.port = opts.port || 8332;
  this.user = opts.user;
  this.pass = opts.pass;
  this.cookie = opts.cookie;
  this.prot = opts.ssl ? https : http;
}

rpcClient.prototype.get_auth = function() {
  var auth;
  if (this.user && this.pass) {
    auth = `${this.user}:${this.pass}`;
  } else if (this.cookie) {
    auth = fs.readFileSync(this.cookie, 'utf8');
  } else {
    var homedir = require('os').homedir();
    try {
      auth = fs.readFileSync(`${homedir}/.bitcoin/.cookie`, 'utf8');
    } catch (e) {
      try {
        auth = fs.readFileSync(`${homedir}/Library/Application Support/Bitcoin/.cookie`, 'utf8');
      } catch (e2) {
        console.log('cannot find bitcoin cookie file; please provide it on startup');
      }
    }
  }
  return Buffer.from(auth).toString('base64');
}

function rpc (request, callback) {
  return new Promise((resolve, reject) => {
    const requestSerialized = JSON.stringify(request);
    const auth = this.get_auth();
    const options = {
      host: this.host,
      port: this.port,
      path: '/',
      method: 'POST',
    };
    let err = null;
    const req = this.prot.request(options, (res) => {
      let buf = '';
      res.on('data', (data) => {
        buf += data;
      });
      res.on('end', () => {
        if (res.statusCode === 401) {
          if (this.calb) {
            return callback(new Error('bitcoin JSON-RPC connection rejected: 401 unauthorized'));
          }
          return reject(new Error('bitcoin JSON-RPC connection rejected: 401 unauthorized'));
        }
        if (res.statusCode === 403) {
          if (this.calb) {
            return callback(new Error('bitcoin JSON-RPC connection rejected: 403 forbidden'));
          }
          return reject(new Error('bitcoin JSON-RPC connection rejected: 403 forbidden'));
        }
        if (err) {
          if (this.calb) {
            return callback(err);
          }
          return reject(err);
        }
        let bufDeserialized;
        try {
          bufDeserialized = JSON.parse(buf);
        } catch (e) {
          if (this.calb) {
            return callback(e);
          }
          return reject(e);
        }
        if (this.calb) {
          return callback(bufDeserialized.error, bufDeserialized);
        }
        if (bufDeserialized.error) {
          return reject(bufDeserialized.error);
        }
        return resolve(bufDeserialized.result);
      });
    });
    req.on('error', (e) => {
      err = new Error(`Could not connect to bitcoin via RPC at \
            host: ${this.host} port: ${this.port} Error: ${e.message}`);
      if (this.calb) {
        return callback(err);
      }
      return reject(err);
    });

    req.setHeader('Content-Length', requestSerialized.length);
    req.setHeader('Content-Type', 'application/json');
    req.setHeader('Authorization', `Basic ${auth}`);
    req.write(requestSerialized);
    req.end();
  });
}

for (const cmd of Object.keys(BC_RPC)) {
  rpcClient.prototype[cmd] = function rpccmd (...args) {
    this.calb = typeof args[args.length - 1] === 'function';
    if (this.calb) {
      return rpc.call(this, {
        method: cmd.toLowerCase(),
        params: slice(args, 0, args.length - 1),
      }, args[args.length - 1]);
    }

    return rpc.call(this, {
      method: cmd.toLowerCase(),
      params: args
    });

  };
}

module.exports = rpcClient;
