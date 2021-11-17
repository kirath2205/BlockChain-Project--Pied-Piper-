import React, { useState, useEffect } from "react";
import { Button, Form, Col, InputGroup } from "react-bootstrap";

import getWeb3 from "../../getWeb3";
import GovToken from "../../contracts/GovToken.json"

const SetCouncilMembers = (props) => {

    const [proposalState, setProposalState] = useState({});
    const [tokenState, setTokenState] = useState({});
    
    const makeInstance = async () => {
		try {
			const web3 = await getWeb3();
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

    const SumbitForm = async () => {

        const { accounts, contract } = proposalState;
        console.log("Council members set");

        const members = [
			0x94255eef3ccdb21e867557dfa3be97aa8b0b9c3824cec3a8e8b80cc66dc862ca,
		];

        for (let i = 0; i < members.length; ++i) {
            console.log(members[i]);

            const response = await contract.methods
				.initial_transfer("council_member", members[i] , 500)
                .send({ from: accounts[0] });
        }
	};
    
    useEffect(() => {
		makeInstance();
	}, []);

	return (
		<div>
			<h1>Set council memebers</h1>
			<Button onClick={SumbitForm}>Set members</Button>
		</div>
	);
};

export default SetCouncilMembers;