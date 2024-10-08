Verified contract- https://www.oklink.com/Amoy/address/0x3Ef45b9A835A1Ba52393E2d6a5669A3E02d91915#code

# NFT Marketplace

## Overview

This project consists of two main smart contracts:

1. **NFT Contract**: Implements ERC721 standard for minting NFTs.
2. **NFT Marketplace Contract**: Allows users to list, buy, and make offers on NFTs.

## Smart Contracts

### NFT Contract

This contract allows users to mint their own NFTs. It follows the ERC721 standard and includes metadata (name, description, image URL).

**Key Functions:**
- `mint(address to, string memory tokenURI)`: Mints a new NFT.
- `tokenURI(uint256 tokenId)`: Returns the metadata of a given token ID.

### NFT Marketplace Contract

This contract allows users to list NFTs for sale, buy listed NFTs, make offers on listed NFTs, and cancel listings. It also supports adding and withdrawing funds.

**Key Functions:**
- `listNFT(address nftAddress, uint256 tokenId, uint256 price)`: Lists an NFT for sale.
- `buyNFT(address nftAddress, uint256 tokenId)`: Buys a listed NFT.
- `makeOffer(address nftAddress, uint256 tokenId)`: Makes an offer on a listed NFT.
- `acceptOffer(address nftAddress, uint256 tokenId, uint256 offerIndex)`: Accepts an offer on a listed NFT.
- `cancelListing(address nftAddress, uint256 tokenId)`: Cancels a listing.
- `addFunds()`: Adds funds to the user's account.
- `withdrawFunds()`: Withdraws funds from the user's account.

## Deployment

### Prerequisites

- Node.js and npm
- Hardhat
- .env file with the following variables:
  - `PRIVATE_KEY`: Your private key for deployment.
  - `AMOY_RPC_URL`: RPC URL for the Amoy testnet.
  - `ETHERSCAN_API_KEY`: API key for Etherscan (or equivalent) for verification.
 

## Interacting with the Smart Contracts

To interact with the deployed smart contracts, you'll need to use `ethers.js` or a similar library. Below are examples of how to mint an NFT, list it for sale, buy it, make an offer, accept an offer, add funds, and withdraw funds.

### Prerequisites

- Ensure you have `ethers.js` installed:
  ```sh
  npm install ethers


### Install Dependencies

```sh
npm install
