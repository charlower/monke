const path = require('path');

require('dotenv').config();
const goerliMnemonic = process.env['GOERLI_MNEMONIC'];
const mainnetMnemonic = process.env['MAINNET_MNEMONIC'];
const infuraKey = process.env['INFURA_KEY'];
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  /**
   * contracts_build_directory tells Truffle where to store compiled contracts
   */
  contracts_build_directory: path.join(
    __dirname,
    '/src/contracts/ethereum-contracts'
  ),

  /**
   * contracts_directory tells Truffle where to find your contracts
   */
  contracts_directory: './contracts/ethereum',

  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // development: {
    //   host: '127.0.0.1', // Localhost (default: none)
    //   port: 7545, // Standard Ethereum port (default: none)
    //   network_id: '*', // Any network (default: none)
    // },
    // local_ethereum: {
    //   network_id: 31337,
    //   host: '127.0.0.1',
    //   port: 9545,
    //   gasPrice: 0,
    // },
    ethereum: {
      network_id: 1,
      chain_id: 1,
      provider: function () {
        return new HDWalletProvider(
          mainnetMnemonic,
          'https://mainnet.infura.io/v3/' + infuraKey,
          0,
          1
        );
      },
    },
    // UNCOMMENT TO USE GOERLI NETWORK
    // Currently, VSCode Extension debugger fails with "truffle-config.js" has incorrect format
    // due to the usage of HDWalletProvider
    goerli: {
      network_id: 5,
      chain_id: 5,
      provider: function () {
        return new HDWalletProvider(
          goerliMnemonic,
          'https://goerli.infura.io/v3/' + infuraKey,
          0,
          1
        );
      },
    },
    dashboard: {
      host: '127.0.0.1',
      port: 24012,
      network_id: '*',
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.13', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
  db: {
    enabled: false,
  },
};
