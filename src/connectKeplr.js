import { SigningCosmWasmClient } from "cosmwasm";
import connectIfNotExists from "./stargazeTestnet";
import mintSender from "./mint";

// console.log(cosmwasm);

const config = {
  chainId: "big-bang-1",
  rpcEndpoint: "https://rpc.big-bang-1.stargaze-apis.com/",
  prefix: "wasm",
  sg721: "stars1uwakrjs8c0mhak9zz3kush2mnsfvweyqm4re70q4rk4msm7hjsnslcr07p", // UPDATE ME to your contract
  minter: "stars1jc4gk0ua02kvrpggat77r25226h6hg5rrfwlywu7zclkdscjwlhqd56hmm", // UPDATE ME to your contract
  mintPriceStars: 200,
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

  const sg721 = config.sg721;

  //These are just tests

  const contract = await client.queryContractSmart(sg721, {
    contract_info: {},
  });
  console.log(contract);
  const token = await client.queryContractSmart(sg721, {
    nft_info: { token_id: "1" },
  });

  console.log(token);

  const account = await client.getChainId();
  console.log(account);
  // mintSender(client, config);
}

window.onload = function () {
  main();
};

// ./node_modules/.bin/esbuild src --bundle --outfile=dist/index.js
