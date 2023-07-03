const Dummy_Token = artifacts.require("Dummy_Token");
const Tether_Token = artifacts.require("Tether_Token");
const staking_dapp = artifacts.require("staking_dapp");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Tether_Token);
  const tether_token = await Tether_Token.deployed();

  await deployer.deploy(Dummy_Token);
  const dummy = await Dummy_Token.deployed();


  await deployer.deploy(staking_dapp, dummy.address, tether_token.address);
  const staking = await staking_dapp.deployed();

  await dummy.transfer(staking.address, web3.utils.toWei('10', 'ether'), { from: accounts[0] });

  await tether_token.transfer(accounts[1], web3.utils.toWei('2', 'ether'));

}