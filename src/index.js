import { NftHelper } from "./nftHelper";
import { UiState } from "./uiState";
import { getKeplrClient } from "./keplrUtils";
import { addTestnetToKeplr } from "./stargazeTestnet";

const allConfig = require("../config");

const config = allConfig.testnet ? allConfig.testnet : allConfig.production;
console.log(config);

// Setup the state machine for handling minting states
// TODO

const main = async () => {
  if (config.testnet) {
    await addTestnetToKeplr();
  }

  const keplrClient = await getKeplrClient(config);
  const nftHelper = new NftHelper(keplrClient, config);
  const uiState = new UiState(nftHelper);
  uiState.updateProgress();
};

window.onload = function () {
  main();
};
