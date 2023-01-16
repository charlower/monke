var MonkeNFT = artifacts.require('MonkeNFT');
var MonkeMarketplace = artifacts.require('MonkeMarketplace');

module.exports = async function (deployer) {
  await deployer.deploy(MonkeMarketplace);
  const marketplace = await MonkeMarketplace.deployed();
  await deployer.deploy(MonkeNFT, marketplace.address);
};
