import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { Button } from "react-bootstrap";
import Typography from "@material-ui/core/Typography";

import ViewProposalModal from "../Modals/ViewProposalModal";

export default function RenderCellGrid(props) {
    const [tableRows, settableRows] = useState([]);
    const [disable, setDisable] = useState(false);

	const columns = [
		{
			field: "actions",
			headerName: "Actions",
			width: 250,
			renderCell: (params) => (
				<span>
					<Typography color="textPrimary">
						<span style={{ height: "100%" }}>
							<ViewProposalModal rowdata={params.row} />

							<Button
                                disabled={disable}
                                variant="outline-danger"
                                style={{
                                    marginRight: "4px",
                                    marginLeft: "4px",
                                }}
                                onClick={() => {
                                    props.reject(params.row.id);
                                }}
							>
								Reject
							</Button>

							<Button
								disabled={disable}
								variant="success"
                                onClick={() => {
                                    // setDisable(true);
                                    props.accept(params.row.id);
                                }}
							>
								Accept
							</Button>
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
			field: "proposal_title",
			headerName: "Proposal title",
			width: 180,
		},
		{
			field: "proposal_text",
			headerName: "Proposal Description",
			width: 250,
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
