// test/NFTMarketplace.test.mjs

import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT Marketplace", function () {
  let MyNFT, myNFT, NFTMarketplace, nftMarketplace;
  let owner, addr1, addr2;
  const tokenURI = "https://example.com/token/1";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy();
    await myNFT.deployed();

    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();
  });

  describe("Minting and Listing NFTs", function () {
    it("Should mint an NFT and list it on the marketplace", async function () {
      await myNFT.connect(owner).mint(tokenURI);
      await myNFT.connect(owner).approve(nftMarketplace.address, 0);
      await nftMarketplace.connect(owner).listNFT(myNFT.address, 0, ethers.utils.parseEther("1"));

      const listing = await nftMarketplace.listings(myNFT.address, 0);
      expect(listing.price.toString()).to.equal(ethers.utils.parseEther("1").toString());
      expect(listing.seller).to.equal(owner.address);
    });

    it("Should buy a listed NFT", async function () {
      await myNFT.connect(owner).mint(tokenURI);
      await myNFT.connect(owner).approve(nftMarketplace.address, 0);
      await nftMarketplace.connect(owner).listNFT(myNFT.address, 0, ethers.utils.parseEther("1"));

      await nftMarketplace.connect(addr1).buyNFT(myNFT.address, 0, { value: ethers.utils.parseEther("1") });

      expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
    });
  });

  describe("Making and Accepting Offers", function () {
    it("Should make an offer on a listed NFT", async function () {
      await myNFT.connect(owner).mint(tokenURI);
      await myNFT.connect(owner).approve(nftMarketplace.address, 0);
      await nftMarketplace.connect(owner).listNFT(myNFT.address, 0, ethers.utils.parseEther("1"));

      await nftMarketplace.connect(addr1).makeOffer(myNFT.address, 0, { value: ethers.utils.parseEther("0.5") });

      const offer = await nftMarketplace.offers(myNFT.address, 0, 0);
      expect(offer.price.toString()).to.equal(ethers.utils.parseEther("0.5").toString());
      expect(offer.buyer).to.equal(addr1.address);
    });

    it("Should accept an offer on a listed NFT", async function () {
      await myNFT.connect(owner).mint(tokenURI);
      await myNFT.connect(owner).approve(nftMarketplace.address, 0);
      await nftMarketplace.connect(owner).listNFT(myNFT.address, 0, ethers.utils.parseEther("1"));

      await nftMarketplace.connect(addr1).makeOffer(myNFT.address, 0, { value: ethers.utils.parseEther("0.5") });

      await nftMarketplace.connect(owner).acceptOffer(myNFT.address, 0, 0);

      expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
    });
  });

  describe("Adding and Withdrawing Funds", function () {
    it("Should add and withdraw funds", async function () {
      await nftMarketplace.connect(addr1).addFunds({ value: ethers.utils.parseEther("1") });

      expect(await nftMarketplace.userFunds(addr1.address)).to.equal(ethers.utils.parseEther("1"));

      await nftMarketplace.connect(addr1).withdrawFunds();

      expect(await nftMarketplace.userFunds(addr1.address)).to.equal(0);
    });
  });
});
