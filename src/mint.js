import { calculateFee, coins, GasPrice } from "@cosmjs/stargate";

async function mintSender(client, config) {
  const offlineSigner = window.getOfflineSigner(config.chainId);
  const accounts = await offlineSigner.getAccounts();

  const MINT_FEE = coins(config.mintPriceStars * 1000000, "ustars");

  const gasPrice = GasPrice.fromString("0ustars");
  const executeFee = calculateFee(300_000, gasPrice);

  const msg = { mint: {} };
  console.log(msg);

  const result = await client.execute(
    accounts[0].address,
    config.minter,
    msg,
    executeFee,
    "mint to sender",
    MINT_FEE
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  //   console.log(wasmEvent.attributes[5].key === "token_id");
  const tokenId = wasmEvent.attributes.find((a) => a.key === "token_id");
  //   console.log(tokenId);
  console.log(`Minted token id:${tokenId.value}`);
  return tokenId.value;
}

export default mintSender;
