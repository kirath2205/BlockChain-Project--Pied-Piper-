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
					<Button
						variant="success"
						onClick={() => {
							props.approve(params.row.id);
						}}
					>
						Approve
					</Button>
				</span>
			),
		},
		{
			field: "id",
			headerName: "Txn ID",
			width: 130,
		},
		{
			field: "type",
			headerName: "Type",
			width: 110,
		},
		{
			field: "tokens",
			headerName: "Tokens",
			width: 150,
		},
		{
			field: "approvals",
			headerName: "Approvals",
			width: 150,
		},
		{
			field: "from",
			headerName: "From",
			width: 150,
		},
		{
			field: "to",
			headerName: "To",
			width: 150,
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
