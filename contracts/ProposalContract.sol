pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";

contract ProposalContract {
    uint public ProposalID = 0;

    address govToken_addr  = 0x1c5Daa6045C2e15134Ec879B79B7EFaeBC7D16fC;
    GovToken gt = GovToken(govToken_addr);
    struct Proposal {
        string proposal_text;
        string proposal_title;
        uint epoch;
        uint votes;
    }

    mapping (uint => mapping(uint => Proposal)) public proposals;
    mapping (uint => uint) public proposal_count_for_epochs;
    mapping (uint => Proposal[]) public approved_proposals_for_epochs;


    event ProposalCreated(uint ProposalID, string proposal_title);

    function addProposal(string memory proposal_text, string memory proposal_title) public returns (uint){
      uint current_e = gt.get_current_epoch();
      proposals[current_e][proposal_count_for_epochs[current_e]] = Proposal(proposal_text, proposal_title , current_e,0);
      
      proposal_count_for_epochs[current_e]++;
      // if (abi.encodePacked(proposal_count_for_epochs[current_e]).length > 0) {
      //   proposal_count_for_epochs[current_e]++;
      // }
      // else {
      //   proposal_count_for_epochs[current_e] = 1;
      // }
      
      emit ProposalCreated(ProposalID, proposal_title);
      return proposal_count_for_epochs[current_e];
    }

    function getProposalCount() public view returns (uint){
      // GovToken gov_t;
      uint current_e = gt.get_current_epoch();
      return proposal_count_for_epochs[current_e];
    }

    function getProposalById(uint id) public view returns (string memory  , string memory ,uint ){
      uint current_e = gt.get_current_epoch();
      return (proposals[current_e][id].proposal_text ,proposals[current_e][id].proposal_title,
      proposals[current_e][id].votes );
    }

    function addVotes(uint id , uint votes)public {
      proposals[gt.get_current_epoch()][id].votes += votes;
    }

    function getVote(uint proposal_id)public view returns (uint){
      return proposals[gt.get_current_epoch()][proposal_id].votes;
    }
    
}