pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract ProposalContract {
    uint public ProposalID = 0;

    struct Proposal {
        string proposal_text;
        string proposal_title;
    }

    mapping(uint => Proposal) public proposals;

    // modifier onlyOwner() {
    //     require(msg.sender == owner);
    //     _;
    // }

    event ProposalCreated(uint ProposalID, string proposal_title);

    function addProposal(string memory proposal_text, string memory proposal_title) public {
        proposals[ProposalID] = Proposal(proposal_text, proposal_title);
        ProposalID++;
        emit ProposalCreated(ProposalID, proposal_title);
    }

    function getProposals() public view returns (string memory) {
        // Proposal[] memory ret = new Proposal[](ProposalID);
        // for (uint i = 0; i < ProposalID; i++) {
        //     ret[i] = proposals[i];
        // }
        string memory temp = "RETURNING STRONINGREGD";
        return temp;
    }
}