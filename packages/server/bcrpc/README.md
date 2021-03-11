# bcrpc

a tiny Bitcoin RPC wrapper for Node.js.

## usage

each rpc function is exposed as a function in an instantiated rpcClient. the first arguments are parsed as array of arguments, as expected by that specific rpc function, see [Bitcoin Core RPC Docs](https://bitcoincore.org/en/doc). the last argument is an optional callback function, if no callback is provided, it will return a promise.

the following program can be saved and and run in the same directory as the ```index.js``` file from bcrpc. it will print out the latest block number along with its hash. change username and password to those from the ```bitcoin.conf``` file and also change the port number to ```18332``` if you are running Bitcoin on testnet. host can also be configured to not use the local one @ 127.0.0.1 with `host: putHostHere`.

```js
const rpcClient = require('./bcrpc/index');
agent = new rpcClient({port: 18332, user: 'username', pass: 'password'});

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

## rpcClient params

parameter | defaults to
----------|---------
host | `127.0.0.1`
port | `8332`
user | null
pass | null

## example

make sure a Bitcoin Core node is running locally for this example. this creates a new project and shows bcrpc being used.

```sh
$ mkdir myproject
$ cd myproject
$ npm init
  [continue with default options]
$ npm install bcrpc
```

create a new file called ```server.js``` and write the following in it (change username and password to those from the ```bitcoin.conf``` file, also change the port number to ```18332``` if you are running Bitcoin on testnet):

```js
const rpcClient = require('bcrpc');
agent = new rpcClient({port: 18332, user: 'username', pass: 'password'});

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

then run ```$ npm start```. You should get the latest block number along with its hash printed out:

```sh
> myproject@1.0.0 start /home/user/myproject
> node server.js

1768837
00000000000009f6c6eba1dde1cf61022ea59d58f31b2e447c25297c29601008
```
