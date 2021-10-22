import React, { useState, useEffect } from 'react';
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import FormikTextfield from '../formComponents/FormikTextfield';

// importing styles
import formClasses from "../Styles/formStyle.module.css";

// importing contract
import ProposalContract from "../../contracts/ProposalContract.json";

import getWeb3 from "../../getWeb3";

const SubmitProposal = () => {

	const [proposalState, setProposalState] = useState({});

	const makeInstance = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = ProposalContract.networks[networkId];
			const instance = new web3.eth.Contract(
				ProposalContract.abi,
				deployedNetwork && deployedNetwork.address
			);

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			// this.setState(
			// 	{ web3, accounts, contract: instance },
			// 	this.runExample
			// );
			setProposalState({ ...proposalState, web3, accounts, contract: instance });
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`
			);
			console.error(error);
		}
	};

	const runExample = async (proposal_text, proposal_title) => {
		const { accounts, contract } = proposalState;

		// Stores a given value, 5 by default.
		await contract.methods
			.addProposal(proposal_text, proposal_title)
			.send({ from: accounts[0] });

		// Get the value from the contract to prove it worked.
		// const response = await contract.methods.get().call();

		// Update state with the result.
		// this.setState({ storageValue: response });
		// setContract({ ...contract, storageValue: response });
	};

	const getAllProposals = async (proposal_text, proposal_title) => {
		const { accounts, contract } = proposalState;

		// Get the value from the contract to prove it worked.
		const response = await contract.methods.getProposals().call();
		console.log(response);
		// Update state with the result.
		// this.setState({ storageValue: response });
		// setContract({ ...contract, storageValue: response });
	};

	useEffect(() => {
		makeInstance();
	}, []);

    const [proposal, setProposal] = useState({
		proposal_text: "",
    });
    const [submitButtom, setSubmitButtom] = useState(false);
    
    const validationSchema = Yup.object().shape({
		proposal_text: Yup.string()
			.min(50, "Proposal must have at least 50 characters")
			.max(500, "FProposal can't be longer than 500 characters")
			.required("Proposal is required"),
    });
    
    const SumbitForm = (values) => {
        console.log("Submitted");
		console.log(values);
		
		runExample(values.proposal_text, "PROPOSAL TITLE");
	}
	
	const DisplayProposals = () => {
		getAllProposals();
	}

	return (
		<div>
			<Formik
				initialValues={{
					proposal_text: "",
				}}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting, resetForm }) => {
					setSubmitting(true);
					SumbitForm(values);
					// resetForm();
					setSubmitting(false);
				}}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
				}) => (
					<div>
						<Form
							onSubmit={handleSubmit}
							className={formClasses.formBody}
						>
							<h3>Propose a feature</h3>

							<FormikTextfield
								label="Proposal description"
								name="proposal_text"
								type="textfield"
								placeholder="Enter proposal description"
							/>
							<br />
							<Button variant="danger" type="submit">
								{submitButtom ? "Loading..." : "Submit"}
							</Button>
						</Form>
					</div>
				)}
			</Formik>
			<Button onClick={DisplayProposals}>Display Proposals</Button>
		</div>
	);
}

export default SubmitProposal;