import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

// screens
import SubmitProposal from "../screens/SubmitProposal";
import ViewProposals from "../screens/ViewProposals";

const drawerWidth = 240;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(9)} + 1px)`,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

const MiniDrawer = props => {
    const { history } = props;
	const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    
    const itemsList = [
		{
			text: "Submit a proposal",
			icon: <MailIcon />,
			onClick: () => history.push("/submit-proposal"),
		},
		{
			text: "View all proposals",
			icon: <MailIcon />,
			onClick: () => history.push("/view-proposals"),
		},
	];

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position="fixed" open={open}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: "36px",
							...(open && { display: "none" }),
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						Pied Piper
					</Typography>
					{/* <Button color="inherit" href="/query">
						Query
					</Button> */}
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={open}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "rtl" ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon />
						)}
					</IconButton>
				</DrawerHeader>
				<Divider />
				{/* <List>
					{["Inbox", "Starred", "Send email", "Drafts"].map(
						(text, index) => (
							<ListItem button key={text}>
								<ListItemIcon>
									{index % 2 === 0 ? (
										<InboxIcon />
									) : (
										<MailIcon />
									)}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						)
					)}
				</List> */}
				<List>
					{itemsList.map((item, index) => {
						const { text, icon, onClick } = item;
						return (
							<ListItem button key={text} onClick={onClick}>
								{icon && <ListItemIcon>{icon}</ListItemIcon>}
								<ListItemText primary={text} />
							</ListItem>
						);
					})}
				</List>
				<Divider />
				<List>
					{["All mail", "Trash", "Spam"].map((text, index) => (
						<ListItem button key={text}>
							<ListItemIcon>
								{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<DrawerHeader />
				<SubmitProposal />
			</Box>

			{/* <Box component="Trash" sx={{ flexGrow: 1, p: 1 }} index={2}>
				<DrawerHeader />
				<ViewProposals />
			</Box> */}
		</Box>
	);
}

export default MiniDrawer;



// import React from "react";
// import {
//   Drawer as MUIDrawer,
//   ListItem,
//   List,
//   ListItemIcon,
//   ListItemText
// } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
// import InboxIcon from "@material-ui/icons/MoveToInbox";
// import MailIcon from "@material-ui/icons/Mail";
// import { withRouter } from "react-router-dom";

// const useStyles = makeStyles({
//   drawer: {
//     width: "190px"
//   }
// });

// const Drawer = props => {
//   const { history } = props;
//   const classes = useStyles();
//   const itemsList = [
// 		{
// 			text: "Submit a proposal",
// 			icon: <MailIcon />,
// 			onClick: () => history.push("/submit-proposal"),
// 		},
// 		{
// 			text: "View all proposals",
// 			icon: <MailIcon />,
// 			onClick: () => history.push("/view-proposals"),
// 		},
// 	];
//   return (
//     <MUIDrawer variant="permanent" className={classes.drawer}>
//       <List>
//         {itemsList.map((item, index) => {
//           const { text, icon, onClick } = item;
//           return (
//             <ListItem button key={text} onClick={onClick}>
//               {icon && <ListItemIcon>{icon}</ListItemIcon>}
//               <ListItemText primary={text} />
//             </ListItem>
//           );
//         })}
//       </List>
//     </MUIDrawer>
//   );
// };

// export default Drawer;
