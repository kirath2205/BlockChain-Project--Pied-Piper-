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
import GovToken from "../../contracts/GovToken.json";

import getWeb3 from "../../getWeb3";

export default class SubmitProposalClass extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counter: 0,
		};
	}

	render() {
		return <div></div>;
	}
}
