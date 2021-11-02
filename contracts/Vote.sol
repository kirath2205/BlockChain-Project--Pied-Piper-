pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";
import "./ProposalContract.sol";

contract Vote is GovToken, ProposalContract{

    struct CastedVote{
        address wallet_address;
        uint votes;
    }
    event VoteCasted(uint ProposalID, uint votes);

    mapping(uint => CastedVote[]) proposal_casted_votes;
    mapping(uint => uint) proposal_vote_count;

    function can_vote(uint vote_count) public view returns (uint){
        if(balances[msg.sender] < vote_count){
            return 0;
        }
        return 1;
    }

    function caste_vote(uint vote_count , uint proposal_id) public returns (uint){
        
        if(can_vote(vote_count) == 1){
            balances[msg.sender] -= vote_count;
            proposal_casted_votes[proposal_id].push(CastedVote(msg.sender , vote_count));
            proposal_vote_count[proposal_id]+=vote_count;
            emit VoteCasted(proposal_id, vote_count);
            return 1;
        }
        return 0;
    }

    funtion find_vote_count_of_proposal(uint proposal_id) public view returns (uint){
        return proposal_vote_count[proposal_id];
    }

    function sort_proposal_according_to_votes() public view returns (){
        pass;
    }

    funtion sort_proposals_according_to_publish_time() public view returns (){
        pass;
    }
    




}