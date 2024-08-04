// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        uint256 price;
        address seller;
    }

    struct Offer {
        uint256 price;
        address buyer;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => mapping(uint256 => Offer[])) public offers;
    mapping(address => uint256) public userFunds; 

    event NFTListed(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed seller);
    event NFTBought(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed buyer);
    event OfferMade(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed buyer);
    event OfferAccepted(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed seller);
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId);
    event FundsAdded(address indexed user, uint256 amount);
    event FundsWithdrawn(address indexed user, uint256 amount);

    constructor() Ownable(0x7fDD9D9699A1Dd6a8Db5bd027803887aA166028b) {}

    function listNFT(address _nftContract, uint256 _tokenId, uint256 _price) external nonReentrant {
        IERC721 nftContract = IERC721(_nftContract);
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(nftContract.getApproved(_tokenId) == address(this), "Marketplace not approved");

        listings[_nftContract][_tokenId] = Listing(_price, msg.sender);

        emit NFTListed(_nftContract, _tokenId, _price, msg.sender);
    }

    function buyNFT(address _nftContract, uint256 _tokenId) external payable nonReentrant {
        Listing memory listing = listings[_nftContract][_tokenId];
        require(listing.price > 0, "NFT not listed");
        require(msg.value == listing.price, "Incorrect value");

        IERC721(_nftContract).transferFrom(listing.seller, msg.sender, _tokenId);
        payable(listing.seller).transfer(msg.value);

        delete listings[_nftContract][_tokenId];

        emit NFTBought(_nftContract, _tokenId, msg.value, msg.sender);
    }

    function makeOffer(address _nftContract, uint256 _tokenId) external payable nonReentrant {
        require(msg.value > 0, "Offer price must be greater than zero");

        offers[_nftContract][_tokenId].push(Offer(msg.value, msg.sender));

        emit OfferMade(_nftContract, _tokenId, msg.value, msg.sender);
    }

    function acceptOffer(address _nftContract, uint256 _tokenId, uint256 _offerIndex) external nonReentrant {
        Offer memory offer = offers[_nftContract][_tokenId][_offerIndex];
        require(offer.price > 0, "Invalid offer");

        IERC721 nftContract = IERC721(_nftContract);
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Not the owner");

        nftContract.transferFrom(msg.sender, offer.buyer, _tokenId);
        payable(msg.sender).transfer(offer.price);

        delete offers[_nftContract][_tokenId][_offerIndex];

        emit OfferAccepted(_nftContract, _tokenId, offer.price, msg.sender);
    }

    function cancelListing(address _nftContract, uint256 _tokenId) external nonReentrant {
        Listing memory listing = listings[_nftContract][_tokenId];
        require(listing.seller == msg.sender, "Not the seller");

        delete listings[_nftContract][_tokenId];

        emit ListingCancelled(_nftContract, _tokenId);
    }

    function addFunds() external payable nonReentrant {
        require(msg.value > 0, "No funds sent");

        userFunds[msg.sender] += msg.value;

        emit FundsAdded(msg.sender, msg.value);
    }

    function withdrawFunds() external nonReentrant {
        uint256 balance = userFunds[msg.sender];
        require(balance > 0, "No funds to withdraw");

        userFunds[msg.sender] = 0;
        payable(msg.sender).transfer(balance);

        emit FundsWithdrawn(msg.sender, balance);
    }

    receive() external payable {}
}
