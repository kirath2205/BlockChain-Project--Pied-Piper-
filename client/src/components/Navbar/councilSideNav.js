import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

// screens
import SubmitProposal from "../screens/SubmitProposal";
import ViewProposals from "../screens/ViewProposals";
import AcceptProposals from "../screens/CouncilScreens/AcceptProposals";
import ViewPendingTransactions from "../screens/CouncilScreens/ViewPendingTransactions";
import EndEpoch from "../screens/CouncilScreens/EndEpoch";
import MintTokens from "../screens/CouncilScreens/MintTokens";
import TransferTokens from "../screens/CouncilScreens/TransferTokens";

import PageNavbar from "./Navbar";

import getWeb3 from "../../getWeb3";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			style={{ width: "100%" }}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		// flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		display: "flex",
		width: "100%",
		// height: 224,
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
		width: "200px",
	},
}));

export default function VerticalTabs() {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const [contract, setContract] = useState();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const makeInstance = async () => {
		const web3 = await getWeb3();
		setContract(web3);
	};

	useEffect(() => {
		makeInstance();
	});

	return (
		<div>
			<PageNavbar />
			<div className={classes.root}>
				<Tabs
					orientation="vertical"
					value={value}
					onChange={handleChange}
					aria-label="Vertical tabs example"
					className={classes.tabs}
				>
					<Tab label="Submit proposal" {...a11yProps(0)} />
					<Tab label="View all proposals" {...a11yProps(1)} />
					<Tab label="Accept proposals" {...a11yProps(2)} />
					<Tab label="View pending transactions" {...a11yProps(3)} />
					<Tab label="Mint new tokens" {...a11yProps(4)} />
					<Tab label="Transfer tokens" {...a11yProps(5)} />
					<Tab label="End epoch" {...a11yProps(6)} />
				</Tabs>
				<TabPanel value={value} index={0}>
					<SubmitProposal contract={contract} />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<ViewProposals contract={contract} />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<AcceptProposals contract={contract} />
				</TabPanel>
				<TabPanel value={value} index={3}>
					<ViewPendingTransactions contract={contract} />
				</TabPanel>
				<TabPanel value={value} index={4}>
					<MintTokens contract={contract} />
				</TabPanel>
				<TabPanel value={value} index={5}>
					<TransferTokens contract={contract} />
				</TabPanel>
				<TabPanel value={value} index={6}>
					<EndEpoch contract={contract} />
				</TabPanel>
			</div>
		</div>
	);
}