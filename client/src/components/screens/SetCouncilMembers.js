import React, { useState, useEffect } from "react";
import { Button, Form, Col, InputGroup } from "react-bootstrap";

import getWeb3 from "../../getWeb3";

import ProposalContract from "../../contracts/ProposalContract.json";
import Approval from "../../contracts/Approval.json";
import Auth from "../../contracts/Auth.json";
import GovToken from "../../contracts/GovToken.json";
import Vote from "../../contracts/Vote.json";

const SetCouncilMembers = (props) => {

	const [govtokenState, setgovtokenState] = useState({});
	const [proposalState, setproposalState] = useState({});
	const [approvalState, setapprovalState] = useState({});
	const [authState, setauthState] = useState({});
	const [voteState, setvoteState] = useState({});
	
    const [tokenState, setTokenState] = useState({});
    
	const makeInstance = async () => {
		// Govtoken
		const web3 = await getWeb3();
		try {
			// const web3 = props.contract;

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = GovToken.networks[networkId];
			const instance = new web3.eth.Contract(
				GovToken.abi,
				deployedNetwork && deployedNetwork.address
			);

			// Set web3, accounts, and contract to the state
			setgovtokenState({
				...govtokenState,
				web3,
				accounts,
				contract: instance,
			});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`
			);
			console.error(error);
		}

		// ProposalContract
		try {
			// const web3 = await getWeb3();
			// const web3 = props.contract;

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = ProposalContract.networks[networkId];
			const instance2 = new web3.eth.Contract(
				ProposalContract.abi,
				deployedNetwork && deployedNetwork.address
			);

			// Set web3, accounts, and contract to the state
			setproposalState({
				...proposalState,
				web3,
				accounts,
				contract: instance2,
			});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`
			);
			console.error(error);
		}

		// Approval
		try {
			// const web3 = await getWeb3();
			// const web3 = props.contract;

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = Approval.networks[networkId];
			const instance = new web3.eth.Contract(
				Approval.abi,
				deployedNetwork && deployedNetwork.address
			);

			// Set web3, accounts, and contract to the state
			setapprovalState({
				...approvalState,
				web3,
				accounts,
				contract: instance,
			});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`
			);
			console.error(error);
		}

		// Auth
		try {
			// const web3 = await getWeb3();
			// const web3 = props.contract;

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = Auth.networks[networkId];
			const instance = new web3.eth.Contract(
				Auth.abi,
				deployedNetwork && deployedNetwork.address
			);

			// Set web3, accounts, and contract to the state
			setauthState({
				...authState,
				web3,
				accounts,
				contract: instance,
			});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`
			);
			console.error(error);
		}

		// Vote
		try {
			// const web3 = await getWeb3();
			// const web3 = props.contract;

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = Vote.networks[networkId];
			const instance = new web3.eth.Contract(
				Vote.abi,
				deployedNetwork && deployedNetwork.address
			);

			// Set web3, accounts, and contract to the state
			setvoteState({
				...voteState,
				web3,
				accounts,
				contract: instance,
			});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`
			);
			console.error(error);
		}
	};

    const SumbitForm = async () => {

        const { accounts, contract } = govtokenState;
        console.log("Council members set");
        console.log("Current account:", accounts[0]);

        const members = [
			"0xa04012468020b2882953614ccb75bdda2bb3e194",
			"0x6C0c626B01aAE4F844773a444a75E9A1C5a7393a",
		];

        for (let i = 0; i < members.length; ++i) {
            console.log(members[i]);

            const response = await contract.methods
				.initial_transfer("council_member", members[i] , 2000000)
                .send({ from: accounts[0] });
		}
		
		// partner transfer
		const response = await contract.methods
			.initial_transfer_partner(
				"0xe85327b5b3a33136d15fd097f6c3b6ed7269d4ea",
				1000000
			)
			.send({ from: accounts[0] });
	};

	const setGovTokenAddresses = async () => {
		const { accounts, contract } = govtokenState;
		
		await govtokenState.contract.methods
			.setContractAddress(
				proposalState.contract._address,
				approvalState.contract._address,
				voteState.contract._address
			)
			.send({ from: accounts[0] });
	};

	const setProposalAddress = async () => {
		const { accounts, contract } = govtokenState;

		await proposalState.contract.methods
			.setContractAddress(govtokenState.contract._address)
			.send({ from: accounts[0] });
	};

	const setApprovalAddress = async () => {
		const { accounts, contract } = govtokenState;

		await approvalState.contract.methods
			.setContractAddress(
				proposalState.contract._address,
				govtokenState.contract._address
			)
			.send({ from: accounts[0] });
	};

	const setAuthAddress = async () => {
		const { accounts, contract } = govtokenState;

		await authState.contract.methods
			.setContractAddress(
				govtokenState.contract._address
			)
			.send({ from: accounts[0] });
	};

	const setVoteAddress = async () => {
		const { accounts, contract } = govtokenState;

		await approvalState.contract.methods
			.setContractAddress(
				govtokenState.contract._address,
				proposalState.contract._address
			)
			.send({ from: accounts[0] });
	};

	const InitializeContracts = async () => {
		const { accounts, contract } = govtokenState;

		console.log(
			proposalState.contract._address,
			approvalState.contract._address,
			voteState.contract._address
		);
		
		setGovTokenAddresses();
		setProposalAddress();
		setApprovalAddress();
		setAuthAddress();
		setVoteAddress();
	}
    
    useEffect(() => {
		makeInstance();
	}, []);

	return (
		<div style={{margin: "20px"}}>
			<h1>Set council members</h1>
			<Button onClick={InitializeContracts}>Initialize contracts</Button>
			<br />
			<br />
			<Button onClick={SumbitForm}>Set members</Button>
		</div>
	);
};

export default SetCouncilMembers;
