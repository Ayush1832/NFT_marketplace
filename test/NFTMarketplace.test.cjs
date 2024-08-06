const { ethers } = require("hardhat");

describe("NFT Marketplace", function () {
  let expect;
  let NFT, nft, NFTMarketplace, nftMarketplace;
  let owner, addr1, addr2;
  const tokenURI = "https://example.com/token";

  before(async () => {
    ({ expect } = await import("chai"));
  });

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();

    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();
  });

  describe("Minting and Listing NFTs", function () {
    it("Should mint an NFT and list it on the marketplace", async function () {
      await nft.connect(owner).mint(tokenURI);
      await nft.connect(owner).approve(nftMarketplace.address, 0);
      await nftMarketplace.connect(owner).listNFT(nft.address, 0, ethers.utils.parseEther("1"));

      const listing = await nftMarketplace.listings(nft.address, 0);
      expect(listing.price.toString()).to.equal(ethers.utils.parseEther("1").toString());
      expect(listing.seller).to.equal(owner.address);
    });

    it("Should buy a listed NFT", async function () {
      await nft.connect(owner).mint(tokenURI);
      await nft.connect(owner).approve(nftMarketplace.address, 0);
      await nftMarketplace.connect(owner).listNFT(nft.address, 0, ethers.utils.parseEther("1"));

      await nftMarketplace.connect(addr1).buyNFT(nft.address, 0, { value: ethers.utils.parseEther("1") });

      expect(await nft.ownerOf(0)).to.equal(addr1.address);
    });
  });

  describe("Making and Accepting Offers", function () {
    it("Should make an offer on a listed NFT", async function () {
      await nft.connect(owner).mint(tokenURI);
      await nft.connect(owner).approve(nftMarketplace.address, 0);
      await nftMarketplace.connect(owner).listNFT(nft.address, 0, ethers.utils.parseEther("1"));

      await nftMarketplace.connect(addr1).makeOffer(nft.address, 0, { value: ethers.utils.parseEther("0.5") });

      const offer = await nftMarketplace.offers(nft.address, 0, 0);
      expect(offer.price.toString()).to.equal(ethers.utils.parseEther("0.5").toString());
      expect(offer.buyer).to.equal(addr1.address);
    });

    it("Should accept an offer on a listed NFT", async function () {
      await nft.connect(owner).mint(tokenURI);
      await nft.connect(owner).approve(nftMarketplace.address, 0);
      await nftMarketplace.connect(owner).listNFT(nft.address, 0, ethers.utils.parseEther("1"));

      await nftMarketplace.connect(addr1).makeOffer(nft.address, 0, { value: ethers.utils.parseEther("0.5") });

      await nftMarketplace.connect(owner).acceptOffer(nft.address, 0, 0);

      expect(await nft.ownerOf(0)).to.equal(addr1.address);
    });
  });

  describe("Adding and Withdrawing Funds", function () {
    it("Should add and withdraw funds", async function () {
      await nftMarketplace.connect(addr1).addFunds({ value: ethers.utils.parseEther("1") });

      expect((await nftMarketplace.userFunds(addr1.address)).toString()).to.equal(ethers.utils.parseEther("1").toString());

      await nftMarketplace.connect(addr1).withdrawFunds();

      expect((await nftMarketplace.userFunds(addr1.address)).toString()).to.equal("0");
    });
  });
});