import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { Button } from "react-bootstrap";
import Typography from "@material-ui/core/Typography";
import { Badge } from "react-bootstrap";

import ViewProposalModal from "../Modals/ViewProposalModal";
import ProposalVoteModal from "../Modals/ProposalVoteModal";

export default function RenderCellGrid(props) {
	const [tableRows, settableRows] = useState([]);

	const columns = [
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
			renderCell: (params) => (
				<span>
					<Typography color="textPrimary">
						<span style={{ height: "100%" }}>
							<ViewProposalModal rowdata={params.row} />
						</span>
					</Typography>
				</span>
			),
		},
		{
			field: "id",
			headerName: "Proposal ID",
			width: 170,
		},
		{
			field: "vote",
			headerName: "Vote count",
			width: 150,
		},
		{
			field: "user",
			headerName: "Author",
			width: 180,
		},
		{
			field: "proposal_title",
			headerName: "Proposal title",
			width: 180,
		},
		{
			field: "proposal_text",
			headerName: "Proposal Description",
			width: 250,

			// renderCell: (params) => (
			// 	<span>
			// 		<Typography color="textPrimary">
			// 			<span style={{ height: "100%" }}>
			// 				{params.value.slice(0, 2).map((t) => (
			// 					<Badge
			// 						key={t}
			// 						pill
			// 						variant="warning"
			// 						style={{ marginRight: "4px" }}
			// 					>
			// 						{t}
			// 					</Badge>
			// 				))}
			// 			</span>
			// 		</Typography>
			// 		<Typography color="textPrimary">
			// 			<span style={{ height: "100%" }}>
			// 				{params.value.slice(2).map((t) => (
			// 					<Badge
			// 						key={t}
			// 						pill
			// 						variant="warning"
			// 						style={{ marginRight: "4px" }}
			// 					>
			// 						{t}
			// 					</Badge>
			// 				))}
			// 			</span>
			// 		</Typography>
			// 	</span>
			// ),
		},
	];

	useEffect(() => {
		if (props.data) settableRows(props.data);
	}, [props.data]);

	return (
		<span style={{ height: 500, width: "100%", marginTop: "20px" }}>
			<DataGrid
				rows={tableRows}
				columns={columns}
				rowHeight={50}
				checkboxSelection
				disableSelectionOnClick
				components={{
					Toolbar: GridToolbar,
				}}
			/>
		</span>
	);
}
