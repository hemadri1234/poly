const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  console.log("Connected to network:", hre.network.name);
  const bridgeAddress = "0xF9bc4a80464E48369303196645e876c8C7D972de"; // address for bridge
  const deployedAddress = "0xAB4f641C787cd50c3d1c53a6088B1407f9F01937"; // address of deployed contract

  const nft = await hre.ethers.getContractFactory("siva");
  const contract = await nft.attach(deployedAddress);
  console.log("Contract address:", contract.address);

  // Token IDs of the NFTs you want to send
  const tokenIds = [0, 1, 2, 3, 4];
  const wallet = "0x330c75B827643Bd2D2b0A61e3fD39f80222Ae05B"; // Wallet address

  // Define the gas limit for the transaction
  const gasLimit = 500000; // Adjust this value as needed

  // Approve and deposit each token to the FxPortal Bridge for sending
  for (let i = 0; i < tokenIds.length; i++) {
    const tokenId = tokenIds[i];
    console.log(`Confirm token with token ID ${tokenId} for transfer`);
    await contract.approve(bridgeAddress, tokenId);

    console.log(`Store token with token ID ${tokenId} on the Bridge`);
    // Increase the gas price for the transaction
    const gasPrice = ethers.utils.parseUnits('100', 'gwei'); // Set the gas price to 100 gwei (adjust as needed)
    await contract["safeTransferFrom(address,address,uint256)"](
      wallet,
      bridgeAddress,
      tokenId,
      { gasPrice, gasLimit } // Pass the gasPrice and gasLimit options
    );

    console.log(`Token with ID ${tokenId} transferred successfully.`);
  }

  console.log("Transfer of tokens executed completely");

  // Print the balance of the wallet
  const walletBalance = await hre.ethers.provider.getBalance(wallet);
  console.log("Balance is:", walletBalance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
