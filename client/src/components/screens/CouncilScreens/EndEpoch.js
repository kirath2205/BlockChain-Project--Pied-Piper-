import React, { useState, useEffect } from "react";
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikTextfield from "../../formComponents/FormikTextfield";
import FormikTextinput from "../../formComponents/FormikTextinput";

// importing styles
import formClasses from "../../Styles/formStyle.module.css";

// importing contract
import GovToken from "../../../contracts/GovToken.json";

import getWeb3 from "../../../getWeb3";

const EndEpoch = (props) => {
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
		// makeInstance();
		const { accounts, contract } = proposalState;

		const response = await contract.methods
			.start_new_epoch()
			.send({ from: accounts[0] });
	};

	const SumbitForm = () => {
		console.log("Submitted");

		SubmitTransaction();
    };
    
    const getEpoch = async () => {
        const { accounts, contract } = proposalState;

        const response = await contract.methods.get_current_epoch().call();
        console.log("Epoch:", response);
    }

    const getBalance = async () => {
		const { accounts, contract } = proposalState;
		
		console.log("Account address:", accounts[0]);

		const response = await contract.methods.getWalletBalance().call();
		console.log("Wallet balance:", response);
    }

	useEffect(() => {
		makeInstance();
	}, []);

	return (
		<div className={formClasses.formBody}>
			<Button variant="danger" onClick={SumbitForm}>
				End epoch
			</Button>
			<br />
			<Button variant="danger" onClick={getEpoch}>
				Get current epoch
			</Button>
			<br />
			<Button variant="danger" onClick={getBalance}>
				Get wallet balance
			</Button>
		</div>
	);
};

export default EndEpoch;
