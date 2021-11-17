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

// proposals table
import AcceptProposalTable from "../../Tables/AcceptProposalTable";
import { proposalDummyData } from "../../DummyData/ProposalData";

import getWeb3 from "../../../getWeb3";

const AcceptProposals = (props) => {
	const [proposalState, setProposalState] = useState({});
	const [proposalData, setProposalData] = useState(proposalDummyData);
    const [allProposals, setAllProposals] = useState([]);
    const [acceptedProposals, setAcceptedProposals] = useState(new Set());

	const makeInstance = async () => {
		try {
			// Get network provider and web3 instance.
			// const web3 = await getWeb3();
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
	};

	const getProposalCount = async () => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods.getProposalCount().call();
		return Number(response);
	};

	const getProposalById = async (id) => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods.getProposalById(id).call();
		return response;
	};

	const saveProposals = async (i) => {
		const tempProp = await getProposalById(i);
        console.log(tempProp);
        
		setAllProposals((oldArray) => [
			...oldArray,
			{
				id: i,
				proposal_text: tempProp["0"],
				proposal_title: tempProp["1"],
				vote: tempProp["2"],
			},
		]);
	};

	const DisplayProposals = async () => {
		const totalProposals = await getProposalCount();
		console.log("Total proposals in blockchain: " + totalProposals);

		setAllProposals([]);

		for (let i = 0; i < totalProposals; i++) {
			saveProposals(i);
		}
	};
    
    const accept = async (id) => {
        console.log("Accepted:", id);
        // var updatedProposals = allProposals;
        // updatedProposals = updatedProposals.filter(p => p.id !== id);
        // setProposalState(updatedProposals);
        setAcceptedProposals((old) => new Set([...old, id]));
    }

    const reject = async (id) => {
		console.log("Rejected:", id);
		var updatedProposals = allProposals;
		updatedProposals = updatedProposals.filter((p) => p.id !== id);
		setProposalState(updatedProposals);
    };
    
    const endVoting = async () => {
        console.log("Voting ended");
        console.log(acceptedProposals);
        setAllProposals([]);
    }

	useEffect(() => {
		makeInstance();
	}, []);

	return (
		<div style={{ height: "100%" }}>
			<div className={formClasses.formWithTable}>
				<h3>Accept/Reject proposals</h3>
				<Button onClick={DisplayProposals}>Get All Proposals</Button>
				<br />
                <Button onClick={endVoting} variant="outline-danger">
					End voting
				</Button>

				<AcceptProposalTable
					data={allProposals}
					contract={proposalState}
					accept={accept}
					reject={reject}
				/>
			</div>
		</div>
	);
};

export default AcceptProposals;