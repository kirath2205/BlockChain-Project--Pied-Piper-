pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";
import "./ProposalContract.sol";

contract Approval {
    GovToken gt;
    ProposalContract p;
    
    uint epoch = 0;
    
    uint approval_count = 0;
    uint[] approved_proposals;
    
    
    mapping(address => uint8) private member_status;
    
    // mapping(uint => uint) private approvals;
    // map epoch and id to number of approvals
    mapping(uint256 => mapping(uint256 => uint256)) private approvals;

    event ProposalsApproved(uint[] ProposalIDs, address councilMember);
    event ProposalsFinalized(uint[] final_proposals);


  
    function approve_proposals(uint[] memory proposalIDs) public returns (uint) {
        // only council member can access TODO
        // they should not have already approved 
        require(member_status[msg.sender] != 1);
        
        // approve (increase proposal approve count)
        uint len = proposalIDs.length;
        for (uint i =0; i<len; i++) {
            approvals[gt.get_current_epoch()][i] += 1;
        }
        // set member status
        member_status[msg.sender] = 1;
        approval_count += 1;
       
        
        emit ProposalsApproved(proposalIDs, msg.sender);
        
        if (approval_count == gt.getCouncilCount()) {
            uint[] memory final_proposals = get_final_proposals();
            reset_member_statuses();
            emit ProposalsFinalized(final_proposals);
        }
        
      
    }
    
    function get_final_proposals() private returns (uint[] memory) {
        // check again whether only 1 proposal can be chosen in the end or multiple
        // loop through the approvals and get the project with the max
        
        
        uint min_approvals = (gt.getCouncilCount() + 1)/2; // > 50% of council members 
       
        //mapping memory current_approvals = approvals[g.get_current_epoch()];
        uint proposal_count = p.getProposalCount();
        
        // uint max_count = 0
        // int winning_proposal
        // for (uint i = 0; i<proposal_count; i++){
        //     if (current_approvals[i] > max_count) {
        //         max_count = current_approvals[i]
        //         winning_proposal = i
        //     }
        // }
        for (uint i = 0; i<proposal_count; i++){
            if (approvals[gt.get_current_epoch()][i] > min_approvals) {
                approved_proposals.push(i);
                // transfer coins to winning proposals 
                (string memory text,string memory title,uint votes,address proposer) = p.getProposalById(i);
                gt.mint_and_tranfer(100, proposer);
            }
        }
        
        
        
        
        return approved_proposals;
        
    }
    
    function reset_member_statuses() private {
        // need a way to get an array of keys - google suggests keeping an external database on top of bc
        //address[] memory council_members = gt.getCouncilMembers();
        address[] memory council_members;
        for (uint i = 0; i< council_members.length; i++){
            member_status[council_members[i]] = 0;
        }
    }
    
    // to check if a member aleader approved
    // function get_member_approval_status() public view returns (uint8) {
    //     return member_status[msg.sender];
    // }
    
    // function get_proposal_approval_count(uint proposalID) public view returns (uint) {
    //     return approvals[proposalID];
    // }
    

  

   
    
}