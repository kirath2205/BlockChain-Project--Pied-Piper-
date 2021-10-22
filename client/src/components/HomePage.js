import React, { useState, useEffect, lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import PageNavbar from "./Navbar/Navbar";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useLocation,
} from "react-router-dom";

// importing pages
import SubmitProposal from "./screens/SubmitProposal";
import ViewProposals from "./screens/ViewProposals";

const HomePage = (props) => {

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Router>
				<PageNavbar />

				<Switch>
					<Route exact path="/" component={ViewProposals} />
					<Route path="/view-proposals" component={ViewProposals} />
					<Route path="/submit-proposal" component={SubmitProposal} />
				</Switch>
			</Router>
		</Suspense>
	);
}

export default HomePage;
