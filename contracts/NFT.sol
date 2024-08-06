
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("NFTtoken", "NFT") Ownable(0xd53082e7b78f687823aE781E924c161E4d7a0d74) {}

    function mint(string memory _tokenURI) external {
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        nextTokenId++;
    }
}
