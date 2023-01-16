var MonkeNFT = artifacts.require('MonkeNFT');
var MonkeMarketplace = artifacts.require('MonkeMarketplace');

async function logNftLists(marketplace) {
  let listedNfts = await marketplace.getListedNfts.call();
  //   const accountAddress = 'FIRST_ACCOUNT_ADDRESS';
  const accountAddress = '0x69663d61041bD0AB00aa40919058B8D41595c9AA';
  let myNfts = await marketplace.getMyNfts.call({ from: accountAddress });
  let myListedNfts = await marketplace.getMyListedNfts.call({
    from: accountAddress,
  });
  console.log(`listedNfts: ${listedNfts.length}`);
  console.log(`myNfts: ${myNfts.length}`);
  console.log(`myListedNfts ${myListedNfts.length}\n`);
}

const main = async (cb) => {
  try {
    const monke = await MonkeNFT.deployed();
    const marketplace = await MonkeMarketplace.deployed();

    console.log('MINT AND LIST 3 NFTs');
    let listingFee = await marketplace.getListingFee();
    listingFee = listingFee.toString();
    let txn1 = await monke.mint('URI1');
    let tokenId1 = txn1.logs[2].args[0].toNumber();
    await marketplace.listNft(monke.address, tokenId1, 1, {
      value: listingFee,
    });
    console.log(`Minted and listed ${tokenId1}`);
    let txn2 = await monke.mint('URI1');
    let tokenId2 = txn2.logs[2].args[0].toNumber();
    await marketplace.listNft(monke.address, tokenId2, 1, {
      value: listingFee,
    });
    console.log(`Minted and listed ${tokenId2}`);
    let txn3 = await monke.mint('URI1');
    let tokenId3 = txn3.logs[2].args[0].toNumber();
    await marketplace.listNft(monke.address, tokenId3, 1, {
      value: listingFee,
    });
    console.log(`Minted and listed ${tokenId3}`);
    await logNftLists(marketplace);

    console.log('BUY 2 NFTs');
    await marketplace.buyNft(monke.address, tokenId1, { value: 1 });
    await marketplace.buyNft(monke.address, tokenId2, { value: 1 });
    await logNftLists(marketplace);

    console.log('RESELL 1 NFT');
    await marketplace.resellNft(monke.address, tokenId2, 1, {
      value: listingFee,
    });
    await logNftLists(marketplace);
  } catch (err) {
    console.log('Doh! ', err);
  }
  cb();
};

module.exports = main;
