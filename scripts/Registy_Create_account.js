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
    const tx = await Registry.createAccount(
        "0x3C3AFA9F2aaf933B2048626cC1278f31155F42D7", // Address of the account created (ERC6551 Account contract)
        5, //  chainId
        "0xFc3287b7508a0783665fbCA5C8847628475c83e9", // parent NFT
        9, // token ID
        0, // salt
        "0x" // init calldata
    );

    const receipt = await tx.wait();

    console.log(receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
