import { ipfsURL } from "./ipfsUtils";
import { calculateFee, coins, GasPrice } from "@cosmjs/stargate";

class NftHelper {
  config;
  client;
  constructor(client, config) {
    this.client = client;
    this.config = config;
  }

  getNftImage = async (tokenId) => {
    const token = await this.client.queryContractSmart(this.config.sg721, {
      nft_info: { token_id: tokenId },
    });
    console.log(token);
    const cleanURL = ipfsURL(token.token_uri);
    const response = await window.fetch(cleanURL);
    const data = await response.json();
    console.log(data);
    const imgSrc = ipfsURL(data.image);
    return imgSrc;
  };

  // https://github.com/public-awesome/stargaze-contracts/blob/main/contracts/sg721/schema/query_msg.json
  getProgress = async () => {
    const tokenQuery1 = await this.client.queryContractSmart(
      this.config.sg721,
      {
        tokens: {
          owner: "stars1ayn0kctdmcjz0mxjgqm6lmhh8uash3q5l97y0y",
        },
      }
    );
    console.log(tokenQuery1);
    const tokenQuery = await this.client.queryContractSmart(this.config.sg721, {
      num_tokens: {},
    });
    return {
      minted: tokenQuery.count,
      total: this.config.totalNumMints,
    };
  };

  mintSender = async () => {
    const offlineSigner = window.getOfflineSigner(this.config.chainId);
    const accounts = await offlineSigner.getAccounts();

    const MINT_FEE = coins(this.config.mintPriceStars * 1000000, "ustars");

    const gasPrice = GasPrice.fromString("0ustars");
    const executeFee = calculateFee(300_000, gasPrice);

    const msg = { mint: {} };
    console.log(msg);

    const result = await this.client.execute(
      accounts[0].address,
      this.config.minter,
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
  };
}

export { NftHelper };
