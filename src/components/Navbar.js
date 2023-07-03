import React, { Component } from 'react';
import mylogo from '../mylogo.jpg';

class Navbar extends Component {

  render() {
	return (
	  <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
	<a
	  className="navbar-brand col-sm-3 col-md-2 mr-0"
	  href="http://localhost:3000/"
	  target="_blank"
	  rel="noopener noreferrer"
	>
	  <img src={mylogo} width="30" height = "30" className="d-inline-block align-top" alt="logo" />
	  <b>Staking Dapp</b>
	</a>
	<ul className="navbar-nav px-3">
	  <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
	    <small className="text-white"><span id="account">{this.props.account}</span></small>
	  </li>
	</ul>
	  </nav>
	);
  }
}

export default Navbar;