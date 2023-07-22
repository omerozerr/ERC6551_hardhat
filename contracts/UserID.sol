// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UserID is ERC721, Ownable {
    using Counters for Counters.Counter;
    uint mintPrice = 0;

    Counters.Counter private _tokenIdCounter;

    string baseURI = "";
    uint public mintStage = 1; // 0 -> paused | 1 -> live
    mapping(address => uint) public CreditscoreMapping;

    constructor() ERC721("UserID", "UID") {}

    function safeMint() public payable {
        require(msg.value == mintPrice, "Not enough ETH sent");
        require(mintStage == 1, "mint is not live");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal pure override {
        require(
            from == address(0) || to == address(0),
            "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner."
        );
    }

    function updateCreditScore(
        address _address,
        uint _newValue
    ) public onlyOwner {
        CreditscoreMapping[_address] = _newValue;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function changeBaseURI(string memory __baseURI) public onlyOwner {
        baseURI = __baseURI;
    }

    function changeMintStage(uint _mintStage) public onlyOwner {
        mintStage = _mintStage;
    }

    function changeMintPrice(uint _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    fallback() external payable {}

    receive() external payable {}

    function withdraw(address _address, uint256 _amount) public onlyOwner {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }
}
