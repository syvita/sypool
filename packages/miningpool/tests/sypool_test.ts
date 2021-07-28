import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v0.6.0/index.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";

Clarinet.test({
  // values taken from
  // https://bitcoindev.network/calculating-the-merkle-root-for-a-block/
  name: "ensure that valid merkle proofs are validated",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let wallet_1 = accounts.get("wallet_1")!;
    let block0 = chain.mineBlock([
      Tx.contractCall(
        "sypool",
        "reverse-buff32",
        ["0x3bd3a1309a518c381248fdc26c3a6bd62c35db7705069f59206684308cc237b3"],
        wallet_1.address
      ),
    ]);
    console.log(block0);

    let block = chain.mineBlock([
      Tx.contractCall(
        "sypool",
        "verify-merkle-proof",
        [
          // reversed tx of
          // 3bd3a1309a518c381248fdc26c3a6bd62c35db7705069f59206684308cc237b3
          "0xb337c28c30846620599f060577db352cd66b3a6cc2fd4812388c519a30a1d33b",
          // reversed merkel root of
          // 0x25c8487847de572c21bff029a95d9a9fecd9f4c2736984b979d37258cd47bd1f
          "0x1fbd47cd5872d379b9846973c2f4d9ec9f9a5da929f0bf212c57de477848c825",
          // proof
          types.tuple({
            "tx-index": types.uint(0),
            hashes: types.list([
              // reversed tx of 0xa99011a19e9894753d6c65c8fa412838ea8042886537588e7205734d5de8956d
              "0x6d95e85d4d7305728e583765884280ea382841fac8656c3d7594989ea11190a9",
            ]),
            "tree-depth": types.uint(1),
          }),
        ],
        wallet_1.address
      ),
      Tx.contractCall(
        "sypool",
        "register-hash",
        ["0x123456"],
        wallet_1.address
      ),
      Tx.contractCall(
        "sypool",
        "reveal-hash",
        [
          // reversed tx of
          // 3bd3a1309a518c381248fdc26c3a6bd62c35db7705069f59206684308cc237b3
          types.tuple({
            header: "0xb337c28c30846620599f060577db352cd66b3a6cc2fd4812388c519a30a1d33b",
            height: types.uint(1)}),
          "0x3bd3a1309a518c381248fdc26c3a6bd62c35db7705069f59206684308cc237b3",
          // proof
          types.tuple({
            "tx-index": types.uint(0),
            hashes: types.list([
              // reversed tx of 0xa99011a19e9894753d6c65c8fa412838ea8042886537588e7205734d5de8956d
              "0x6d95e85d4d7305728e583765884280ea382841fac8656c3d7594989ea11190a9",
            ]),
            "tree-depth": types.uint(1),
          }),
          "0x123456",
        ],
        wallet_1.address
      ),
    ]);
    assertEquals(block.height, 3);
    assertEquals(block.receipts[0].result, "(ok true)");
  },
});
