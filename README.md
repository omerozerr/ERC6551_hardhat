Basic Scripts and Contracts to work with ERC6551

Try running some of the following tasks:

```shell
npx hardhat run scripts/Registy_Create_account.js  => to run the account creation and other functionalities of the register and account
npx hardhat verify --network goerli <address> => to verify the contracts in the etherscan
npx hardhat run scripts/deployAccount.js --network goerli => to deploy Account to goerli
npx hardhat run scripts/deployRegistry.js --network goerli => to deploy Registry to goerli
```

Example .env:

```shell
PRIVATE_KEY=<your private key>
GOERLI_RPC_URL=https://eth-goerli.g.alchemy.com/v2/<your alchemy apı key>
ETHERSCAN_API_KEY=<your etherscan apı key>
INFURA_KEY = <your infura apı key>
```
