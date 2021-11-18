pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";
import "./ProposalContract.sol";

contract Approval {
    GovToken gt = GovToken(0x93E36d47cC365B5aA6bDfB54020cdB3901DdA075);
    
    address proposal_contract_address = 0x07e000cD1CfBA707a4A2a976c11B8ee009B1C670;
    ProposalContract p = ProposalContract(proposal_contract_address);
    
    
    uint approval_count = 0;
    // mapping of epoch to approved_proposals
    mapping(uint => uint[]) approved_proposals;
    
    
    mapping(address => uint8) private member_status;
    
    // map epoch and id to number of approvals
    mapping(uint256 => mapping(uint => uint)) private approvals;
    

    event ProposalsApproved(uint[] ProposalIDs, address councilMember);
    event ProposalsFinalized(uint[] final_proposals);
    
    function getApprovalsByEpoch(uint epoch) public view returns (uint[] memory) {
        return approved_proposals[epoch];
    }

  
    function approve_proposals(uint[] memory proposalIDs) public returns (uint) {
        // only council member can access 
        require(gt.check_if_council_member_new(msg.sender) == 1);
        // they should not have already approved 
        require(member_status[msg.sender] != 1);
        
        // approve (increase proposal approve count)
        uint len = proposalIDs.length;
        for (uint i =0; i<len; i++) {
            approvals[gt.get_current_epoch()][proposalIDs[i]] += 1;
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
 
        uint min_approvals = (gt.getCouncilCount() + 1)/2; // > 50% of council members 
       
        uint proposal_count = p.getProposalCount();
        
    
        for (uint i = 0; i<proposal_count; i++){
            if (approvals[gt.get_current_epoch()][i] >= min_approvals) {
                approved_proposals[gt.get_current_epoch()].push(i);
                // transfer coins to winning proposals 
                address proposer = p.getProposer(i);
                gt.mint_and_tranfer(100, proposer);
            }
        }
        
        return approved_proposals[gt.get_current_epoch()];
        
    }
    
    
    function reset_member_statuses() private {
        // need a way to get an array of keys - google suggests keeping an external database on top of bc
        address[] memory council_members = gt.getCouncilMembers();
        
        for (uint i = 0; i< council_members.length; i++){
            member_status[council_members[i]] = 0;
        }
        
        approval_count = 0;
    }
    
    // returns 1 if a member already submitted his approvals
    function get_member_approval_status() public view returns (uint8) {
        return member_status[msg.sender];
    }
    
    function get_proposal_approval_count(uint proposalID) public view returns (uint256) {
        return approvals[gt.get_current_epoch()][proposalID];
    }
    
    function setContractAddress(address proposal_add , address govtoken_add) public {
        p = ProposalContract(proposal_add);
        gt = GovToken(govtoken_add);
    }
    
    
}