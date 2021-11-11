import React, { useState, useEffect } from "react";
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikTextfield from "../formComponents/FormikTextfield";
import FormikTextinput from "../formComponents/FormikTextinput";

// importing styles
import formClasses from "../Styles/formStyle.module.css";

// importing contract
import Auth from "../../contracts/Auth.json";

// navbar
import PageNavbar from "../Navbar/mainNavbar";

import getWeb3 from "../../getWeb3";

const Login = () => {

    const [proposalState, setProposalState] = useState({});

    const validationSchema = Yup.object().shape({
		username: Yup.string()
			.min(2, "Username must have at least 2 characters")
			.max(500, "Username can't be longer than 500 characters")
			.required("Username is required"),
		password: Yup.string()
			.min(2, "Password must have at least 2 characters")
			.max(60, "Password can't be longer than 60 characters")
			.required("Password title is required"),
	});

    const makeInstance = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = Auth.networks[networkId];
			const instance = new web3.eth.Contract(
				Auth.abi,
				deployedNetwork && deployedNetwork.address,
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

    const accountLogin = async (values) => {
		const { accounts, contract } = proposalState;
        contract.options.address = "0xEF82476Ea92D95195C1D1352A70f6D41E5e7A1c9";

        const response = await contract.methods
            .login(values.username, values.password)
            .call({ from: accounts[0] });
        
		console.log("Login response:", response);
            
        // var loginUnsuccessful = contract.events.loginUnsuccessful();
        // loginUnsuccessful
		// 	.on("data", function (event) {
		// 		console.log(event); // same results as the optional callback above
		// 	})
		// 	.on("changed", function (event) {
		// 		// remove event from local database
		// 	})
		// 	.on("error", console.error);
	}
    
    const SumbitForm = (values) => {
		console.log("Submitted:", values);
        
        accountLogin(values);
    };
    
	useEffect(() => {
		makeInstance();
	}, []);

	return (
		<div>
			<PageNavbar />
			<div className={formClasses.pageBackground}>
				<div className={formClasses.formBody}>
					<div className={formClasses.formContent}>
						<Formik
							initialValues={{
								username: "",
								password: "",
							}}
							validationSchema={validationSchema}
							onSubmit={(
								values,
								{ setSubmitting, resetForm }
							) => {
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
										<h3>Login</h3>

										<FormikTextinput
											label="Username"
											name="username"
											type="text"
											placeholder="Enter username"
										/>

										<FormikTextinput
											label="Password"
											name="password"
											type="password"
											placeholder="Enter password"
										/>

										<br />
										<Button variant="danger" type="submit">
											Login
										</Button>
									</Form>
								</div>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
