import React, { useState, useEffect } from "react";
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikTextfield from "../formComponents/FormikTextfield";
import FormikTextinput from "../formComponents/FormikTextinput";

// importing styles
import formClasses from "../Styles/formStyle.module.css";

// importing contract
import ProposalContract from "../../contracts/ProposalContract.json";
import Vote from "../../contracts/Vote.json";

// proposals table
import ViewProposalTable from '../Tables/ViewProposalTable';
import { proposalDummyData } from '../DummyData/ProposalData';

import getWeb3 from "../../getWeb3";

const ViewProposals = (props) => {
	const [proposalState, setProposalState] = useState({});
	const [proposalState2, setProposalState2] = useState({});
	const [proposalData, setProposalData] = useState(proposalDummyData);
    const [allProposals, setAllProposals] = useState([]);

	const makeInstance = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = props.contract;

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = ProposalContract.networks[networkId];
			const instance = new web3.eth.Contract(
				ProposalContract.abi,
				deployedNetwork && deployedNetwork.address
			);
			
			// Set web3, accounts, and contract to the state
			setProposalState({
				...proposalState,
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

		// Vote contract
		try {
			// Get network provider and web3 instance.
			const web3 = props.contract;

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
			setProposalState2({
				...proposalState,
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
    
    const getProposalCount = async () => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods
			.getProposalCount()
			.call({ from: accounts[0] });
        return Number(response);
    }
    
    const getProposalById = async (id) => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods
			.getProposalById(id)
			.call({ from: accounts[0] });
		// console.log(response);
		return response;
	};

	const saveProposals = async (i) => {
		const tempProp = await getProposalById(i);
		console.log(tempProp);
		// setAllProposals([...allProposals, tempProp]);
		setAllProposals((oldArray) => [
			...oldArray,
			{
				id: i,
				proposal_text: tempProp["0"],
				proposal_title: tempProp["1"],
				vote: tempProp["2"],
			},
		]);
	}
    
	const DisplayProposals = async () => {
        const totalProposals = await getProposalCount();
        console.log("Total proposals in blockchain: " + totalProposals);

		setAllProposals([]);

		for (let i = 0; i < totalProposals; i++) {
			saveProposals(i);
		}
	}

	const canVote = async (votes) => {
		const { accounts, contract } = proposalState2;
		const response = await contract.methods
			.can_vote(parseInt(votes))
			.call({ from: accounts[0] });
		return response;
	}

	const voteproposal = async (id, votes) => {
		const { accounts, contract } = proposalState2;

		const eligible = await canVote(votes);
		console.log("Voting eligibility:", eligible);

		if (eligible === "1") {
			console.log(id, votes);
			await contract.methods
				.caste_vote(parseInt(votes), id)
				.send({ from: accounts[0] });

			DisplayProposals();
		}
		else {
			console.log("Not enough Gov tokens to vote!");
			window.alert("Not enough Gov tokens to vote!");
		}
	}

	useEffect(() => {
		makeInstance();
    }, []);

	return (
		<div style={{ height: "100%" }}>
			<div className={formClasses.formWithTable}>
				<h3>View Proposals</h3>
				<Button onClick={DisplayProposals}>Get All Proposals</Button>

				<ViewProposalTable
					data={allProposals}
					contract={proposalState}
					voteproposal={voteproposal}
				/>
			</div>
		</div>
	);
};

export default ViewProposals;
