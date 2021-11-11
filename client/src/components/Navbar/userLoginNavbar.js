import { Typography } from "@material-ui/core";
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
			<div
				style={{
					border: "1px solid white",
					borderRadius: "5px",
					padding: "0 5px",
				}}
			>
				<Typography style={{ color: "white" }}>
					Platform User
				</Typography>
			</div>
			<Container style={{ justifyContent: "flex-end" }}>
				<Nav>
					<Nav.Link href="/login">Sign out</Nav.Link>
					{/* <Nav.Link href="/register">Register</Nav.Link> */}
				</Nav>
			</Container>
		</Navbar>
	);
};

export default PageNavbar;
