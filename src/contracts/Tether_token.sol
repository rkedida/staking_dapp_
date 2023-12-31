// SPDX-License-Identifier: MIT

pragma solidity >= 0.4.22 < 0.9.0;

contract Tether_Token{
	string public name = "dummy Tether Token";
	string public symbol = "Tether";
	uint totalSupply = 100 * 10 ** 18;
	uint public decimals = 18;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint _value
	);

	event Approve(
		address indexed _owner,
		address indexed _spender,
		uint _value
	);

	mapping(address => uint) public balanceOf;
	mapping(address => mapping(address => uint)) public allowance;

	constructor(){
		balanceOf[msg.sender] = totalSupply;
	}

	function transfer(address _to, uint256 _value) public returns(bool success){
		require(balanceOf[msg.sender] >= _value);
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
		return true;
	}

	function approve(address _spender, uint256 _value) public returns(bool success){
		allowance[msg.sender][_spender] = _value;
		emit Approve(msg.sender, _spender, _value);
		return true;
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
		require(_value <= balanceOf[_from]);
		require(_value <= allowance[_from][msg.sender]);
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		allowance[_from][msg.sender] -= _value;
		emit Transfer(_from, _to, _value);
		return true;
	}
}