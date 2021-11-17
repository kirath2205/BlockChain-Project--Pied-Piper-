import { Input } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Badge } from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import FormikTextinput from "../formComponents/FormikTextinput";

import Web3 from "web3";
import ProposalContract from "../../contracts/ProposalContract.json";

function MyVerticallyCenteredModal(props) {

	const [proposalState, setProposalState] = useState({});

    const validationSchema = Yup.object().shape({
		vote: Yup.number()
			.min(1, "Vote count must be atleast 1 or more")
			.max(1000000000, "Vote count can't be longer than 1000,000,000")
			.required("Vote count is required")
			.typeError("Vote count must be numerical"),
	});
    
    const SumbitForm = async (values) => {
		// console.log(values);
		// console.log(props);
		props.voteproposal(props.rowdata.id, values.vote);
        props.onHide();
	}

	return (
		<Modal
			// {...props}
			show={props.show}
			onHide={props.onHide}
			size="md"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Proposal ID: {props.rowdata.id}
					<Badge
						pill
						variant="success"
						style={{ marginRight: "2px", marginLeft: "15px" }}
						onClick={() => console.log("vote clicked")}
					>
						Votes: {props.rowdata.vote}
					</Badge>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						vote: "",
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

								<FormikTextinput
									label="Vote count"
									name="vote"
									type="text"
									placeholder="Enter number of votes"
								/>

								<br />
								<Button variant="success" type="submit">
									Vote
								</Button>
							</Form>
						</div>
					)}
				</Formik>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ProposalVoteModal(props) {
	const [modalShow, setModalShow] = React.useState(false);

	return (
		<>
			<Button
				variant="success"
				onClick={() => setModalShow(true)}
				style={{ marginLeft: "4px" }}
			>
				Vote
			</Button>

			<MyVerticallyCenteredModal
				show={modalShow}
				onHide={() => setModalShow(false)}
				rowdata={props.rowdata}
				voteproposal={props.voteproposal}
			/>
		</>
	);
}

export default ProposalVoteModal;
