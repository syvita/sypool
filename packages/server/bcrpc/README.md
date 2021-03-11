# bcrpc

Tiny Bitcoin RPC wrapper for Node.js.

## Usage

Each rpc function is exposed as a function in an instantiated RpcAgent. The first arguments are parsed as array of arguments, as expected by that specific rpc function, see [Bitcoin Core RPC Docs](https://bitcoincore.org/en/doc). The last argument is an optional callback function, if no callback is provided, it will return a promise.

The following program can be saved and and run in the same directory as the ```index.js``` file from bcrpc. It will print out the latest block number along with its hash. Change username and password to those from the ```bitcoin.conf``` file and also change the port number to ```18332``` if you are running Bitcoin on testnet.

```js
const RpcAgent = require('./bcrpc/index');
agent = new RpcAgent({port: 18332, user: 'username', pass: 'password'});

// Using Callbacks
agent.getBlockCount(function (err, blockCount) {
  if (err)
    throw Error(JSON.stringify(err));
  console.log(blockCount.result);
  agent.getBlockHash(blockCount.result, function (err, hash) {
    if (err)
      throw Error(JSON.stringify(err));
    console.log(hash.result);
  })
});

// Using Promises
agent.getBlockCount()
.then((blockCount) => {
  console.log(blockCount);
  return agent.getBlockHash(blockCount);
})
.then((hash) => {
  console.log(hash);
})
.catch((err) => {
  console.error(err);
  return err;
});
```

## Example

Make sure a Bitcoin Core node is running on your system already. This example creates a new project and shows bcrpc being used.

```sh
$ mkdir myproject
$ cd myproject
$ npm init
  [continue with default options]
$ npm install bcrpc
```

Create a new file called ```server.js``` and write the following in it (change username and password to those from the ```bitcoin.conf``` file, also change the port number to ```18332``` if you are running Bitcoin on testnet):

```js
const RpcAgent = require('bcrpc');
agent = new RpcAgent({port: 18332, user: 'username', pass: 'password'});

agent.getBlockCount(function (err, blockCount) {
  if (err)
    throw Error(JSON.stringify(err));
  console.log(blockCount.result);
  agent.getBlockHash(blockCount.result, function (err, hash) {
    if (err)
      throw Error(JSON.stringify(err));
    console.log(hash.result);
  })
});
```

Then run ```$ npm start```. You should get the latest block number along with its hash printed out:

```sh
> myproject@1.0.0 start /home/user/myproject
> node server.js

1768837
00000000000009f6c6eba1dde1cf61022ea59d58f31b2e447c25297c29601008
```
