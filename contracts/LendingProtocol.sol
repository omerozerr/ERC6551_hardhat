// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IUserID {
    function CreditscoreMapping(address user) external view returns (uint);

    function updateCreditScore(address _address, uint _newValue) external;
}

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint);
}

contract LendingContract {
    IUserID public userID;
    IERC20 public token;
    mapping(address => uint) public SuppliedETHinWei;
    mapping(address => uint) public SuppliedTokeninWei;

    mapping(address => uint) public CreditScoreBonusAfterBorrow;

    constructor(address _userID, address _token) {
        userID = IUserID(_userID);
        token = IERC20(_token);
    }

    function getCreditScore(address user) public view returns (uint) {
        // Get the credit score from the UserID contract
        return userID.CreditscoreMapping(user);
    }

    function updateCreditScore(address _address, uint _newValue) public {
        // Update the credit score in the UserID contract
        userID.updateCreditScore(_address, _newValue);
    }

    function supplyViaETH() public payable {
        require(getCreditScore(msg.sender) != 0, "User does not have user ID");
        require(msg.value <= msg.sender.balance, "Not enough ETH");
        require(msg.value > 0, "Amount must be greater than 0");

        SuppliedETHinWei[msg.sender] += msg.value;
    }

    function supplyViaToken(uint _amount) public {
        require(getCreditScore(msg.sender) != 0, "User does not have user ID");
        require(_amount > 0, "Amount must be greater than 0");
        require(
            token.balanceOf(msg.sender) >= _amount,
            "Insufficient token balance"
        );

        // Check that the contract has enough allowance to perform the transfer.
        // This also ensures that the token contract address is not zero because the EVM reverts with a 'divide by zero' error.
        require(
            token.allowance(msg.sender, address(this)) >= _amount,
            "Token is not approved"
        );

        // Perform the transfer and allow it to revert if anything goes wrong
        token.transferFrom(msg.sender, address(this), _amount);

        // Update the state to reflect the new supply
        SuppliedTokeninWei[msg.sender] += _amount;
    }

    function borrowETH(uint _amount) public {
        require(getCreditScore(msg.sender) != 0, "User does not have user ID");
        require(_amount > 0, "Amount must be greater than 0");

        uint userCreditScore = getCreditScore(msg.sender);
        uint userMultiplier = getMultiplier(userCreditScore);
        uint maxiumumAllowwableBorrow = (SuppliedETHinWei[msg.sender] *
            userMultiplier) / 1e18;
        require(
            _amount <= maxiumumAllowwableBorrow,
            "You cant borrow more than your limit"
        );
        require(address(this).balance > _amount, "Not enough ETH in contract.");
        payable(msg.sender).transfer(_amount);
    }

    function getMultiplier(uint _creditScore) public pure returns (uint) {
        if (_creditScore >= 360 && _creditScore < 400) {
            return 65 * (10 ** 16); // 0.65
        } else if (_creditScore >= 400 && _creditScore < 440) {
            return 7 * (10 ** 17); // 0.7
        } else if (_creditScore >= 440 && _creditScore <= 500) {
            return 75 * (10 ** 16); // 0.75
        }
        revert("Invalid credit score");
    }

    fallback() external payable {}

    receive() external payable {}
}
