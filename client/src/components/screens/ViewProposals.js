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

import getWeb3 from "../../getWeb3";

const ViewProposals = () => {

    const [proposalState, setProposalState] = useState({});

    const [allProposals, setAllProposals] = useState([]);

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
    }
    
    const getProposalById = async (id) => {
		const { accounts, contract } = proposalState;

		const response = await contract.methods.getProposalById(id).call();
		// console.log(response);
		return response;
	};
    
    const DisplayProposals = async () => {
        const totalProposals = await getProposalCount();
        console.log("Total proposals in blockchain: " + totalProposals);

        for (let i = 0; i < totalProposals; i++) {
            const tempProp = await getProposalById(i);
            console.log(tempProp);
            // setAllProposals([...allProposals, tempProp]);
			setAllProposals((oldArray) => [...oldArray, tempProp]);
		}
    }

	useEffect(() => {
		makeInstance();
    }, []);

	return (
		<div className={formClasses.formBody}>
			<h1>View Proposals</h1>
			<Button onClick={DisplayProposals}>Get All Proposals</Button>

			{allProposals.map((proposal, ind) => {
				// return <div>{proposal["0"]}</div>
				// console.log("FROM DIV" + proposal);
				// return <div key={ind}> {JSON.stringify(proposal)} </div>;
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
			})}
		</div>
	);
};

export default ViewProposals;
