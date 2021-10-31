import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

const PageNavbar = () => {

	return (
		<Navbar bg="dark" variant="dark">
			<Navbar.Brand>
				<img
					src="./blockchain-logo.png"
					// width="30"
					height="30"
					className="d-inline-block align-top"
					alt="React Bootstrap logo"
				/>
			</Navbar.Brand>
			<Container style={{ justifyContent: "flex-end" }}>
				<Nav>
					<Nav.Link href="/view-proposals">View Proposals</Nav.Link>
					<Nav.Link href="/submit-proposal">Submit Proposals</Nav.Link>
					<Nav.Link href="/login">Login</Nav.Link>
					<Nav.Link href="/register">Register</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);
}

export default PageNavbar;
