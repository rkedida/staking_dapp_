// SPDX-License-Identifier: MIT

pragma solidity >= 0.4.22 < 0.9.0;

import "./Dummy_token.sol";
import "./Tether_token.sol";

contract staking_dapp{
	string public name = "staking_dapp";
	address public owner;
	Dummy_Token public dummy_token;
	Tether_Token public tether_token;

	address[] public stakers;
	mapping(address => uint) public stakingbalance;
	mapping(address => bool) public hasstaked;
	mapping(address => bool) public isstaked;

	constructor(Dummy_Token _dummy_token, Tether_Token _tether_token) {
		dummy_token = _dummy_token;
		tether_token = _tether_token;
		owner = msg.sender;
	}

	function stakeTokens(uint _amount) public{
		require(_amount > 0, "amount cannot be 0");
		dummy_token.transferFrom(msg.sender, address(this), _amount);
		stakingbalance[msg.sender] = stakingbalance[msg.sender] + _amount;
		if(!hasstaked[msg.sender]){
			stakers.push(msg.sender);
		}
		isstaked[msg.sender] = true;
		hasstaked[msg.sender] = true;
	}

	function unstakeTokens() public{
		uint balance = stakingbalance[msg.sender];
		require(balance > 0, "staking balance cannot be 0");
		dummy_token.transfer(msg.sender, balance);
		stakingbalance[msg.sender] = 0;
		isstaked[msg.sender] = false;
	}

	function issueDummy() public{
		require(msg.sender == owner, "caller must be the owner");
		for(uint i=0; i<stakers.length; i++){
			address recipient = stakers[i];
			uint balance = stakingbalance[recipient] / 9;
			if(balance > 0){
				dummy_token.transfer(recipient, balance);
			}
		}
	}
}