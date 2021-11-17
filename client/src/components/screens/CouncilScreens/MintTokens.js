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

import getWeb3 from "../../../getWeb3";

const MintTokens = (props) => {
	const [proposalState, setProposalState] = useState({});
	const [tokenState, setTokenState] = useState({});

	const makeInstance = async () => {
		// console.log("outside");
		try {
			// console.log("inside");
			// const web3 = await getWeb3();
            const web3 = props.contract;

			// console.log("finished");

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

	const SubmitTransaction = async (tokens) => {
		makeInstance();
		const { accounts, contract } = proposalState;

		const response = await contract.methods
			.mintTokens(tokens)
			.send({ from: accounts[0] });
	};

	const validationSchema = Yup.object().shape({
		tokens: Yup.number()
			.min(1, "Tokens must be atleast 1 or more")
			.required("Tokens to mint is required")
			.typeError("Tokens must be numerical"),
	});

	const SumbitForm = (values) => {
		console.log("Submitted");
		console.log(values);

		SubmitTransaction(values.tokens);
	};

	useEffect(() => {
		makeInstance();
	}, []);

	return (
		<div className={formClasses.formBody}>
			<Formik
				initialValues={{
					tokens: "",
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
							<h3>Request new tokens</h3>

							<FormikTextinput
								label="Tokens"
								name="tokens"
								type="text"
								placeholder="Enter token amount to mint"
							/>

							<br />
							<Button variant="danger" type="submit">
								Request
							</Button>
						</Form>
					</div>
				)}
			</Formik>
			{/* <br />
			<Button onClick={getProposalCount}>Get Count</Button> */}
		</div>
	);
};

export default MintTokens;
