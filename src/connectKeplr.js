import { SigningCosmWasmClient } from "cosmwasm";
import connectIfNotExists from "./stargazeTestnet";

// console.log(cosmwasm);

const config = {
  chainId: "big-bang-1",
  rpcEndpoint: "https://rpc.big-bang-1.stargaze-apis.com/",
  prefix: "wasm",
};

const setupWebKeplr = async () => {
  // check browser compatibility
  if (!window.keplr) {
    throw new Error("Keplr is not supported or installed on this browser!");
  }

  // try to enable keplr with given chainId
  await window.keplr.enable(config.chainId).catch(() => {
    throw new Error("Keplr can't connect to this chainId!");
  });

  const { prefix, gasPrice } = config;

  // Setup signer
  const offlineSigner = await window.getOfflineSignerAuto(config.chainId);

  // Init SigningCosmWasmClient client
  const signingClient = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    offlineSigner,
    {
      prefix,
      gasPrice,
    }
  );

  return signingClient;
};

async function main() {
  // await window.keplr.enable(config.chainId);
  connectIfNotExists();

  const client = await setupWebKeplr(config);
  console.log(client);

  const sg721 =
    "stars1uwakrjs8c0mhak9zz3kush2mnsfvweyqm4re70q4rk4msm7hjsnslcr07p";
  const contract = await client.queryContractSmart(sg721, {
    contract_info: {},
  });
  console.log(contract);
  const token = await client.queryContractSmart(sg721, {
    nft_info: { token_id: "1" },
  });

  console.log(token);
}

window.onload = function () {
  main();
};

// ./node_modules/.bin/esbuild src --bundle --outfile=dist/index.js
