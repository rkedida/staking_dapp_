import React, { Component } from 'react';
// import logo from '../logo.svg';
import './App.css';
import Web3 from 'web3';
import TetherToken from '../build/Tether_Token.json';
import DummyToken from '../build/Dummy_Token.json';
import StakingDapp from '../build/staking_dapp.json';
import Main from './Main';
import Navbar from './Navbar';


class MyApp extends Component {
	
	constructor(props) {
		super(props)
		this.state = {
			account: '0x0',
			tetherToken: {},
			dummyToken: {},
			stakingDapp: {},
			tetherTokenBalance: '0',
			dummyTokenBalance: '0',
			stakingBalance: '0',
			loading: true
		}
	}
	
	// async componentWillMount() {
	// 	try {
	// 		await this.loadWeb3();
	// 		await this.loadBlockchainData();
	// 	} catch (error) {
	// 		console.error("Error loading blockchain data:", error);
	// 		this.setState({ loading: false });
	// 	}
	// }

	componentDidMount() {
			this.loadWeb3().then(() => {
			this.loadBlockchainData().catch((error) => {
				console.error("Error loading blockchain data:", error);
				this.setState({ loading: false });
			});
		});
	}

	async loadBlockchainData() {
		console.log('loadBlockchainData called');
		const web3 = window.web3
		const accounts = await web3.eth.getAccounts()
		this.setState({ account: accounts[0] })
		const networkId = await web3.eth.net.getId()
		const TetherTokenData = TetherToken.networks[networkId]
		if (TetherTokenData){
			const tetherToken = new web3.eth.Contract(TetherToken.abi, TetherTokenData.address)
			this.setState({ tetherToken })
			let tetherTokenBalance = await tetherToken.methods.balanceOf(this.state.account).call()
			this.setState({ tetherTokenBalance: tetherTokenBalance.toString() })
		}
		const DummyTokenData = DummyToken.networks[networkId]
		if (DummyTokenData){
			const dummyToken = new web3.eth.Contract(DummyToken.abi, DummyTokenData.address)
			this.setState({ dummyToken })
			let dummyTokenBalance = await dummyToken.methods.balanceOf(this.state.account).call()
			this.setState({ dummyTokenBalance: dummyTokenBalance.toString() })
		}
		const StakingDappData = StakingDapp.networks[networkId]
		if (StakingDappData){
			const stakingDapp = new web3.eth.Contract(StakingDapp.abi, StakingDappData.address)
			this.setState({ stakingDapp })
			let stakingBalance = await stakingDapp.methods.stakingbalance(this.state.account).call()
			this.setState({ stakingBalance: stakingBalance.toString() })
		}
		this.setState({ loading: false });
	}

	async loadWeb3() {
		if (window.ethereum){
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		}
		else if (window.web3){
			window.web3 = new Web3(window.web3.currentProvider)
		}
		else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
	}

	stakeTokens = async (amount) => {
		if (!this.state.tetherToken) {
			console.error('TetherToken is not defined');
			return;
		  }
		this.setState({ loading: true })
		 this.state.tetherToken.methods.approve(this.state.stakingDapp._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
			this.state.stakingDapp.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
				this.setState({ loading: false })
				
			})
		})
	}

	// stakeTokens = async (amount) => {
	// 	if (!this.state.tetherToken) {
	// 	  console.error('TetherToken is not defined');
	// 	  return;
	// 	}
	// 	this.setState({ loading: true });
	// 	this.state.tetherToken.methods.approve(this.state.stakingDapp._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
	// 	  this.state.tetherToken.methods.allowance(this.state.account, this.state.stakingDapp._address).call()
	// 		.then(allowance => {
	// 		  if (parseInt(allowance) >= amount) {
	// 			this.state.stakingDapp.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
	// 			  this.setState({ loading: false });
	// 			})
	// 		  }
	// 		});
	// 	});
	//   };

	unstakeTokens = async (amount) => {
		this.setState({ loading: true })
		 this.state.stakingDapp.methods.unstakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
			this.setState({ loading: false })
		})
	}

	// constructor(props) {
	// 	super(props)
	// 	this.state = {
	// 		account: '0x0',
	// 		tetherToken: {},
	// 		dummyToken: {},
	// 		stakingDapp: {},
	// 		tetherTokenBalance: '0',
	// 		dummyTokenBalance: '0',
	// 		stakingBalance: '0',
	// 		loading: true
	// 	}
	// }

	render() {
        let content
		if(this.state.loading){
			content = <p id='loader' className="text-center">Loading...</p>
		} else{
			content = <Main
				tetherTokenBalance = {this.state.tetherTokenBalance}
				dummyTokenBalance = {this.state.dummyTokenBalance}
				stakingBalance = {this.state.stakingBalance}
				stakeTokens = {this.stakeTokens}
				unstakeTokens = {this.unstakeTokens}
			/>
		}
		return (
			<div>
				<Navbar account={this.state.account} />
				<div className="container-fluid mt-5">
					<div className="row">
						<main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
							<div className="content mr-auto ml-auto">
								<a
									href="http://www.dappuniversity.com/bootcamp"
									target="_blank"
									rel="noopener noreferrer"
								>
								</a>
									{content}
							</div>
						</main>
					</div>
				</div>
			</div>
		);
    }
}
export default MyApp;