import React, { useState, useEffect } from "react";
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikTextfield from "../../formComponents/FormikTextfield";
import FormikTextinput from "../../formComponents/FormikTextinput";

// importing styles
import formClasses from "../../Styles/formStyle.module.css";

// importing contract
import ProposalContract from "../../../contracts/ProposalContract.json"

// proposals table
import PastProposalsTable from "../../Tables/PastProposalsTable";
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

	const getTotalEpochs = async() => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods.get_current_epoch().call();
		console.log("RESP:", response);
		return Number(response);
	}

	const getProposalCount = async () => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods.getPastProposalCount(0).call();
		return Number(response);
	};

	const getProposalById = async (id) => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods.getPastProposal(id, 0).call();
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
				user: tempProp["3"],
			},
		]);
	};

	const DisplayProposals = async () => {

		const totalEpochs = await getTotalEpochs();
		console.log("Total epochs:", totalEpochs);

		const totalProposals = await getProposalCount();
		console.log("Total past proposals in blockchain: " + totalProposals);

		setAllProposals([]);

		for (let i = 0; i < totalProposals; i++) {
			saveProposals(i);
		}
	};

	const handleProposalClick = (proposal, ind) => {
		console.log(proposal, ind);
	};

	useEffect(() => {
		makeInstance();
	}, []);

	return (
		<div style={{ height: "100%" }}>
			<div className={formClasses.formWithTable}>
				<h3>View Past Proposals</h3>
				<Button onClick={DisplayProposals}>Get past Proposals</Button>

				{/* {allProposals.map((proposal, ind) => {
					return (
						<div
							key={ind}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								background: "#f58e64",
								padding: "20px",
								marginTop: "10px",
							}}
							onClick={() =>
								handleProposalClick(proposal, ind)
							}
						>
							<div>
								{" "}
								<b>Proposal:</b> {proposal["0"]}{" "}
							</div>
							<div>
								{" "}
								<b>Title:</b> {proposal["1"]}{" "}
							</div>
						</div>
					);
				})} */}

				<PastProposalsTable
					data={allProposals}
					contract={proposalState}
				/>
			</div>
		</div>
	);
};

export default ViewPastProposals;
