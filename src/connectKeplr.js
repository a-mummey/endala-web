const cosmwasm = require("cosmwasm");

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
  const signingClient = await cosmwasm.SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    offlineSigner,
    {
      prefix,
      gasPrice,
    }
  );

  return signingClient;
};

const defaultBech32Config = (
  mainPrefix,
  validatorPrefix = "val",
  consensusPrefix = "cons",
  publicPrefix = "pub",
  operatorPrefix = "oper"
) => {
  return {
    bech32PrefixAccAddr: mainPrefix,
    bech32PrefixAccPub: mainPrefix + publicPrefix,
    bech32PrefixValAddr: mainPrefix + validatorPrefix + operatorPrefix,
    bech32PrefixValPub:
      mainPrefix + validatorPrefix + operatorPrefix + publicPrefix,
    bech32PrefixConsAddr: mainPrefix + validatorPrefix + consensusPrefix,
    bech32PrefixConsPub:
      mainPrefix + validatorPrefix + consensusPrefix + publicPrefix,
  };
};

async function main() {
  // await window.keplr.enable(config.chainId);
  console.log(
    window.keplr.experimentalSuggestChain({
      chainId: "big-bang-1",
      rpc: "https://rpc.big-bang-1.stargaze-apis.com/",
      rest: "https://rest.big-bang-1.stargaze-apis.com/",
      chainName: "Stargaze Test",
      bech32Config: defaultBech32Config("stars"),
      bip44: {
        coinType: 118,
      },
      stakeCurrency: {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        coinGeckoId: "stargaze",
        coinImageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/stargaze.png",
      },
      nativeCurrency: "STARS",
      currencies: [
        {
          coinDenom: "STARS",
          coinMinimalDenom: "ustars",
          coinDecimals: 6,
          coinGeckoId: "stargaze",
          coinImageUrl:
            "https://dhj8dql1kzq2v.cloudfront.net/white/stargaze.png",
        },
      ],
      feeCurrencies: [
        {
          coinDenom: "STARS",
          coinMinimalDenom: "ustars",
          coinDecimals: 6,
          coinGeckoId: "stargaze",
          coinImageUrl:
            "https://dhj8dql1kzq2v.cloudfront.net/white/stargaze.png",
        },
      ],
      features: ["stargate", "no-legacy-stdTx", "ibc-transfer", "ibc-go"],
      chainSymbolImageUrl:
        "https://dhj8dql1kzq2v.cloudfront.net/white/stargaze.png",
      txExplorer: {
        name: "TestScan",
        txUrl: "http://38.242.223.192/big-bang-1/tx/{txHash}",
      },
    })
  );

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
