import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Badge } from "react-bootstrap";

function MyVerticallyCenteredModal(props) {
	return (
		<Modal
			{...props}
			size="lg"
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
				<h4>{props.rowdata.proposal_title}</h4>

				<p>{props.rowdata.proposal_text}</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ViewProposalModal(props) {
	const [modalShow, setModalShow] = React.useState(false);

	return (
		<>
			<Button
				variant="outline-primary"
				onClick={() => setModalShow(true)}
			>
				View
			</Button>

			<MyVerticallyCenteredModal
				show={modalShow}
                onHide={() => setModalShow(false)}
                rowdata={props.rowdata}
			/>
		</>
	);
}

export default ViewProposalModal;