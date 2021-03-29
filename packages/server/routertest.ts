import { Application } from "https://deno.land/x/abc@v1.3.0/mod.ts";
import { makeContractCall, BufferCV, broadcastTransaction, FungibleConditionCode, makeStandardSTXPostCondition } from "https://x.mtavr.se/transactions.ts";
import { StacksTestnet, StacksMainnet } from "https://x.mtavr.se/network.ts";
import * as BigNum from "https://x.mtavr.se/bn.js";

// for mainnet, use `StacksMainnet()`
const network = new StacksTestnet();

// Add an optional post condition
// See below for details on constructing post conditions
const postConditionAddress = 'SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE';
const postConditionCode = FungibleConditionCode.GreaterEqual;
const postConditionAmount = new BigNum(1000000);
const postConditions = [
  makeStandardSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
];

const txOptions = {
  contractAddress: 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X',
  contractName: 'contract_name',
  functionName: 'contract_function',
  functionArgs: [bufferCVFromString('foo')],
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
  validateWithAbi: true,
  network,
  postConditions,
};

const transaction = await makeContractCall(txOptions);

broadcastTransaction(transaction, network);

const app = new Application();

console.log("http://localhost:8080/");

app
  .get("/hello", (c) => {
    return "Hello, Abc!";
  })
  .start({ port: 8080 });