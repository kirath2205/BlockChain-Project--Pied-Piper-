import React, { useState } from 'react';
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import FormikTextfield from '../formComponents/FormikTextfield';

// importing styles
import formClasses from "../Styles/formStyle.module.css";

const SubmitProposal = () => {

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
    }

    return (
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
					<Form onSubmit={handleSubmit} className={formClasses.formBody}>
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
	);
}

export default SubmitProposal;