import React, { useState, useEffect, lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import PageNavbar from "./Navbar/Navbar";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useLocation,
} from "react-router-dom";

// navbars
import userSideNav from './Navbar/userSideNav';
import userNavbar from './Navbar/userNavbar';
import councilSideNav from './Navbar/councilSideNav';

// importing pages
import SubmitProposal from "./screens/SubmitProposal";
import ViewProposals from "./screens/ViewProposals";
import NotLoggedIn from "./screens/NotLoggedIn";
import Login from "./screens/Login";
import Register from "./screens/Register";

const HomePage = (props) => {

	// const [contract, setContract] = useState({});

	// const makeInstance = async () => {
	// 	try {
	// 		// Get network provider and web3 instance.
	// 		const web3 = await getWeb3();

	// 		// Use web3 to get the user's accounts.
	// 		const accounts = await web3.eth.getAccounts();

	// 		// Get the contract instance.
	// 		const networkId = await web3.eth.net.getId();
	// 		const deployedNetwork = ProposalContract.networks[networkId];
	// 		const instance = new web3.eth.Contract(
	// 			ProposalContract.abi,
	// 			deployedNetwork && deployedNetwork.address
	// 		);

	// 		// Set web3, accounts, and contract to the state, and then proceed with an
	// 		// example of interacting with the contract's methods.
	// 		// this.setState(
	// 		// 	{ web3, accounts, contract: instance },
	// 		// 	this.runExample
	// 		// );
	// 		setContract({ ...contract, web3, accounts, contract: instance });
	// 	} catch (error) {
	// 		// Catch any errors for any of the above operations.
	// 		alert(
	// 			`Failed to load web3, accounts, or contract. Check console for details.`
	// 		);
	// 		console.error(error);
	// 	}
	// };

	// const runExample = async () => {
	// 	const { accounts, contract } = this.state;

	// 	// Stores a given value, 5 by default.
	// 	await contract.methods.set(5).send({ from: accounts[0] });

	// 	// Get the value from the contract to prove it worked.
	// 	const response = await contract.methods.get().call();

	// 	// Update state with the result.
	// 	// this.setState({ storageValue: response });
	// 	setContract({ ...contract, storageValue: response });
	// };

	// useEffect(() => {
	// 	makeInstance();
	// }, []);


	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Router>
				{/* <PageNavbar /> */}

				<Switch>
					<Route exact path="/" component={Login} />
					<Route exact path="/council-login" component={councilSideNav} />
					<Route exact path="/user-login" component={userSideNav} />
					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
					<Route path="/error" component={NotLoggedIn} />
					{/* <userSideNav /> */}
					<Route path="/view-proposals" component={ViewProposals} />
					<Route path="/submit-proposal" component={SubmitProposal} />
				</Switch>
				<Switch></Switch>
			</Router>
		</Suspense>
	);
}

export default HomePage;
