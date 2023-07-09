const { ethers } = require("ethers");
require("dotenv").config();

// Replace these with your Infura project ID and private key
const infuraProjectId = process.env.INFURA_KEY;
const privateKey = process.env.PRIVATE_KEY;

// Replace this with the ABI of the ERC6551Registry contract
const ERC6551RegistryABI = [
    { inputs: [], name: "InitializationFailed", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "implementation",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "tokenContract",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "salt",
                type: "uint256",
            },
        ],
        name: "AccountCreated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "implementation",
                type: "address",
            },
            { internalType: "uint256", name: "chainId", type: "uint256" },
            { internalType: "address", name: "tokenContract", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "uint256", name: "salt", type: "uint256" },
        ],
        name: "account",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "implementation",
                type: "address",
            },
            { internalType: "uint256", name: "chainId", type: "uint256" },
            { internalType: "address", name: "tokenContract", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "uint256", name: "salt", type: "uint256" },
            { internalType: "bytes", name: "initData", type: "bytes" },
        ],
        name: "createAccount",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const ERC6551AccountABI = [
    {
        inputs: [
            { internalType: "uint256", name: "_size", type: "uint256" },
            { internalType: "uint256", name: "_start", type: "uint256" },
            { internalType: "uint256", name: "_end", type: "uint256" },
        ],
        name: "InvalidCodeAtRange",
        type: "error",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "executeCall",
        outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "hash", type: "bytes32" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "isValidSignature",
        outputs: [
            { internalType: "bytes4", name: "magicValue", type: "bytes4" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nonce",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
        ],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [],
        name: "token",
        outputs: [
            { internalType: "uint256", name: "chainId", type: "uint256" },
            { internalType: "address", name: "tokenContract", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const RegistryAddress = "0x2018a38f1c8e486a99c0729e6cf8337f5401ceb9";

async function main() {
    const provider = new ethers.JsonRpcProvider(
        `https://goerli.infura.io/v3/${infuraProjectId}`
    );
    const wallet = new ethers.Wallet(privateKey, provider);

    const Registry = new ethers.Contract(
        RegistryAddress,
        ERC6551RegistryABI,
        wallet
    );

    // Now you can call functions on the Registry contract
    // Creating ERC6551 Account from registry.
    /*const tx = await Registry.createAccount(
        "0xA601bEF0d7f417AB74074Ef0E2fB205669243f50", // Address of the account created (ERC6551 Account contract)
        5, //  chainId
        "0xFc3287b7508a0783665fbCA5C8847628475c83e9", // parent NFT
        9, // token ID
        0, // salt
        "0x" // init calldata
    );*/

    // Getting Account address
    const NewAccountAddress = await Registry.account(
        "0xA601bEF0d7f417AB74074Ef0E2fB205669243f50", // Address of the account created (ERC6551 Account contract)
        5, //  chainId
        "0xFc3287b7508a0783665fbCA5C8847628475c83e9", // parent NFT
        9, // token ID
        0 // salt
    );

    console.log("Account Created at:", NewAccountAddress);

    const recipientAddress = NewAccountAddress;
    const amountToSend = ethers.parseEther("0.02");

    const transaction = {
        to: recipientAddress,
        value: amountToSend,
    };

    await wallet
        .sendTransaction(transaction)
        .then((tx) => {
            console.log("Transaction sent");
        })
        .catch((error) => {
            console.error("Failed to send transaction:", error);
        });

    const Account_contract = new ethers.Contract(
        NewAccountAddress,
        ERC6551AccountABI,
        wallet
    );

    const owner = await Account_contract.owner();
    console.log(owner);

    // Balance can't be updated instantly. Returns the old value
    //const balance = await provider.getBalance(NewAccountAddress);
    //console.log("Balance of the Account: ", ethers.formatEther(balance));

    const sendETHfromAccount = await Account_contract.executeCall(
        "0xEC6c574E296e5553F7C59f01e122Abc0340f0D4E",
        "10000000000000000",
        "0x"
    );

    console.log(sendETHfromAccount);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
