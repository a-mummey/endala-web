import { SigningCosmWasmClient } from "cosmwasm";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import connectIfNotExists from "./stargazeTestnet";
import mintSender from "./mint";

// console.log(cosmwasm);
let client;
let state = "loading";
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
  const mintButton = document.getElementById("mintButton");
  const toggleButton = (t) => {
    if (t) {
      mintButton.classList.remove("secondary");
      mintButton.innerHTML = "Mint";
    } else {
      mintButton.classList.add("secondary");
      mintButton.innerHTML = "Loading...";
    }
  };
  // await window.keplr.enable(config.chainId);
  connectIfNotExists();

  const client = await setupWebKeplr(config);
  const stargazeClient = await CosmWasmClient.connect(config.rpcEndpoint);
  console.log(client);
  const ipfsURL = (url) => url.replace("ipfs:/", "https://ipfs.io/ipfs");

  // const sg721 = config.sg721;

  //These are just tests

  // const contract = await client.queryContractSmart(sg721, {
  //   contract_info: {},
  // });
  // console.log(contract);
  // const token = await client.queryContractSmart(sg721, {
  //   nft_info: { token_id: "1" },
  // });

  // console.log(token);
  state = "ready";
  toggleButton(true);
  mintButton.onclick = async (ev) => {
    ev.preventDefault();
    if (state === "ready") {
      if (client) {
        toggleButton(false);
        mintButton.classList.add("secondary");
        state = "transacting";
        const tokenId = await mintSender(client, config);

        const token = await client.queryContractSmart(config.sg721, {
          nft_info: { token_id: tokenId },
        });
        console.log(token);
        /*
        {
            "token_uri": "ipfs://bafybeidvpmkguc4pgcxap5nfcj4lrvko77qnw3t7jsiiabzpnotsujnq3q/galaxylRaspa/12",
            "extension": {}
        }*/

        const cleanURL = ipfsURL(token.token_uri);
        const response = await window.fetch(cleanURL);
        const data = await response.json();
        const imgSrc = ipfsURL(data.image);
        const imgEl = document.getElementById("endala-img");
        const imgWrapEl = document.getElementById("endala-img-wrap");

        imgEl.src = imgSrc;
        imgWrapEl.style.display = "block";
        state = "ready";
        toggleButton(true);
      }
    }
  };
}

window.onload = function () {
  main();
};

// ./node_modules/.bin/esbuild src --bundle --outfile=dist/index.js
