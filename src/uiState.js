class UiState {
  nftHelper;
  mintButton;
  constructor(nftHelper) {
    this.nftHelper = nftHelper;
    this.button = document.getElementById("mintButton");
    this.button.onclick = this.mint;
    this.toggleButton(true);
  }

  toggleButton = (t) => {
    if (t) {
      mintButton.classList.remove("secondary");
      mintButton.innerHTML = "Mint";
    } else {
      mintButton.classList.add("secondary");
      mintButton.innerHTML = "Loading...";
    }
  };

  mint = async (e) => {
    console.log(e);
    e.preventDefault();
    if (this.nftHelper.client) {
      this.toggleButton(false);
      const tokenId = await this.nftHelper.mintSender();
      this.toggleButton(true);
      this.showMinted(tokenId);
      this.updateProgress();
    }
  };

  showMinted = async (tokenId) => {
    const imgSrc = await this.nftHelper.getNftImage(tokenId);
    const imgEl = document.getElementById("endala-img");
    const imgWrapEl = document.getElementById("endala-img-wrap");
    imgWrapEl.style.display = "block";
    imgEl.src = imgSrc;
  };

  updateProgress = async () => {
    const progress = await this.nftHelper.getProgress();
    const progressWrap = document.getElementById("mint-progress-wrap");
    const progressTotal = document.getElementById("mint-progress-total");
    const progressNum = document.getElementById("mint-progress-count");
    const progressBar = document.getElementById("mint-progress-bar");
    progressBar.setAttribute("value", progress.minted);
    progressBar.setAttribute("max", progress.total);
    progressTotal.innerHTML = progress.total;
    progressNum.innerHTML = progress.minted;
    progressWrap.style.display = "block";
  };
}

export { UiState };
