import React, { useState, useEffect } from 'react';
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikTextfield from '../formComponents/FormikTextfield';
import FormikTextinput from '../formComponents/FormikTextinput';

// importing styles
import formClasses from "../Styles/formStyle.module.css";

// importing contract
import ProposalContract from "../../contracts/ProposalContract.json";
import GovToken from "../../contracts/GovToken.json";

import getWeb3 from "../../getWeb3";

const SubmitProposal = () => {

	const [proposalState, setProposalState] = useState({});
	const [tokenState, setTokenState] = useState({});

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

			// Set web3, accounts, and contract to the state
			setProposalState({ ...proposalState, web3, accounts, contract: instance });
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`
			);
			console.error(error);
		}


		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

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
			setTokenState({
				...tokenState,
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

	const submitProposal = async (proposal_text, proposal_title) => {
		const { accounts, contract } = proposalState;

		await contract.methods
			.addProposal(proposal_text, proposal_title, 0)
			.send({ from: accounts[0] });
	};

	const getProposalCount = async () => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods.getProposalCount().call();
		console.log(response);
	}

	const getProposalById = async (id) => {
		id = 1;
		const { accounts, contract } = proposalState;

		const response = await contract.methods.getProposalById(id).call();
		console.log(response);
	};

    const [submitButtom, setSubmitButtom] = useState(false);
    
    const validationSchema = Yup.object().shape({
		proposal_text: Yup.string()
			.min(5, "Proposal must have at least 5 characters")
			.max(500, "FProposal can't be longer than 500 characters")
			.required("Proposal is required"),
		proposal_title: Yup.string()
			.min(5, "Title must have at least 5 characters")
			.max(60, "Title can't be longer than 60 characters")
			.required("Proposal title is required"),
	});
    
    const SumbitForm = (values) => {
        console.log("Submitted");
		console.log(values);
		
		submitProposal(values.proposal_text, values.proposal_title);
	}

	useEffect(() => {
		makeInstance();
	}, []);

	return (
		<div className={formClasses.formBody}>
			<Formik
				initialValues={{
					proposal_text: "",
					proposal_title: "",
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
						<Form onSubmit={handleSubmit}>
							<h3>Propose a feature</h3>

							<FormikTextinput
								label="Proposal title"
								name="proposal_title"
								type="text"
								placeholder="Enter proposal title"
							/>

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
			<br />
			<Button onClick={getProposalCount}>Get Count</Button>
			<br />
			<Button onClick={getProposalById}>Get Proposal by ID</Button>
		</div>
	);
}

export default SubmitProposal;