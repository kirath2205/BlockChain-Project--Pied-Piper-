import React, { useState, useEffect } from "react";
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikTextfield from "../../formComponents/FormikTextfield";
import FormikTextinput from "../../formComponents/FormikTextinput";

// importing styles
import formClasses from "../../Styles/formStyle.module.css";

// importing contract
import ProposalContract from "../../../contracts/ProposalContract.json";
import GovToken from "../../../contracts/GovToken.json";

// proposals table
import PendingTransactionsTable from "../../Tables/PendingTransactionsTable";
import { proposalDummyData } from "../../DummyData/ProposalData";

import getWeb3 from "../../../getWeb3";

const ViewPastProposals = (props) => {
	const [proposalState, setProposalState] = useState({});
	const [proposalData, setProposalData] = useState(proposalDummyData);
	const [allProposals, setAllProposals] = useState([]);

	const makeInstance = async () => {
		try {
			// Get network provider and web3 instance.
			// const web3 = await getWeb3();
			const web3 = props.contract;

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
	};

	const getProposalCount = async () => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods.getTransactionCount().call();
		return Number(response);
	};

	const getProposalById = async (id) => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods
			.getTransactionById(id)
			.call();
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
				type: tempProp["0"],
				from: tempProp["1"],
				to: tempProp["2"],
				tokens: tempProp["3"],
				approvals: tempProp["4"],
			},
		]);
	};

	const DisplayTransactions = async () => {
		const totalTransactions = await getProposalCount();
        // const totalTransactions = 1;
		console.log("Total transactions in blockchain: " + totalTransactions);

		setAllProposals([]);

		for (let i = 0; i < totalTransactions; i++) {
			saveProposals(i);
		}
	};

	const handleProposalClick = (proposal, ind) => {
		console.log(proposal, ind);
    };
    
    const approve = async (id) => {
		console.log("Txn approve:", id);
		const { accounts, contract } = proposalState;

		await contract.methods
			.signTransaction(id)
			.send({ from: accounts[0] });
    }

	useEffect(() => {
		makeInstance();
	}, []);

	return (
		<div style={{ height: "100%" }}>
			<div className={formClasses.formWithTable}>
				<h3>View Pending Transactions</h3>
				<Button onClick={DisplayTransactions}>Get transactions</Button>

				<PendingTransactionsTable
					data={allProposals}
					contract={proposalState}
					approve={approve}
				/>
			</div>
		</div>
	);
};

export default ViewPastProposals;
