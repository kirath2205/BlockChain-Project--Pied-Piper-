pragma solidity >=0.4.21 <0.7.0;
import "./Vote.sol";
import "./ProposalContract.sol";
import "./Approval.sol";
import "./Safemath.sol";

// contract SafeMath {
 
//     function safeAdd(uint a, uint b) public pure returns (uint c) {
//         c = a + b;
//         require(c >= a);
//     }
 
//     function safeSub(uint a, uint b) public pure returns (uint c) {
//         require(b <= a);
//         c = a - b;
//     }
 
//     function safeMul(uint a, uint b) public pure returns (uint c) {
//         c = a * b;
//         require(a == 0 || c / a == b);
//     }
 
//     function safeDiv(uint a, uint b) public pure returns (uint c) {
//         require(b > 0);
//         c = a / b;
//     }
// }
 
 
//ERC Token Standard #20 Interface
contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function transfer(address to, uint tokens) public returns (uint success);
    function transferFrom(address from, address to, uint tokens) public returns (uint success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    
}
 
contract GovToken is ERC20Interface {
    // change deployment addresses after deployment
    address proposal_contract_address = 0x40B4A36A8f733BbeC4E65FdD75Cd522faB53AeF5;
    ProposalContract p = ProposalContract(proposal_contract_address);

    address vote_contract_address = 0xD1DD440475d2d5b9185927B3751C8f716aEcABD2;
    Vote vote = Vote(vote_contract_address);
    address approval_contract_address = 0xec43E121aA96b79a4166FdB6CA0A353A415C14b0;
    Approval approval = Approval(approval_contract_address);

    string public symbol;
    string public  name;
    uint public _totalSupply;
    uint current_epoch = 0;
    bool council_meeting = false;
    
    address internal _driver;
    mapping(address => uint8) internal _councilMembers;
    address[] internal councilMembersList;
    
    uint private MIN_SIGNATURES = 0;
    

    // struct Council{
    //     address root_user;
    //     address council_member_one;
    //     address council_member_two;
    // }
    
    modifier isOwner() {
        require(msg.sender == _driver);
        _;
    }

    modifier validOwner() {
        require(msg.sender == _driver || _councilMembers[msg.sender] == 1);
        _;
    }
    
  
    
    using SafeMath for uint256;
    mapping(address => uint256) public balances;
    mapping(address => string) account_type;
    // Council newCouncil = Council(address(0) , address(0) , address(0));
    
    constructor(string memory _name , string memory _symbol , uint _supply) public {
        symbol = _symbol;
        name = _name;
        _totalSupply = _supply;
        balances[msg.sender] = _supply;
        // newCouncil.root_user = msg.sender;
        _driver = msg.sender;
        councilMembersList.push(msg.sender);
        emit Transfer(address(0), msg.sender, _supply);
    }

    function revert_casted_votes_after_epoch_ends() internal {
        uint end = p.getProposalCount();
        for(uint i=0;i<end;i++){
            uint casted_votes = vote.get_casted_votes_array_length(i);
            for(uint k=0;k<casted_votes;k++){
                (uint votes ,address  wallet_address ) = vote.get_token_and_address_for_a_cast(i,k);
                balances[wallet_address] = balances[wallet_address].add(votes);
            }
        }
    }
    // add a modifier to check if the msg.sender is a council member
    function start_new_epoch() validOwner public returns (uint){
       
        // require(msg.sender == approval_contract_address, "Only the Approval contract can call start_new_epoch()");
        
        revert_casted_votes_after_epoch_ends();
        vote.clear_casted_votes_after_epoch_ends();
        
        toggle_council_meeting();
        
        approval.decide_final_approvals();       // rewarding the approved proposal
        vote.reward_most_voted_proposal();       // most voted reward
        
        increment_epoch();

        return 1;
        
    }

    function getWalletBalance() public view returns(uint, address, uint, address){
      return (balances[msg.sender], msg.sender, balances[_driver], _driver);
    }

    function getAccountType() public view returns (string memory){
      return account_type[msg.sender];
    }
    
    function initial_transfer(string memory wallet_type, address receiver_address , uint tokens) isOwner public returns (uint){
        
        if(balances[receiver_address] == 0 && keccak256(abi.encodePacked(account_type[receiver_address])) == keccak256(abi.encodePacked(""))){

            if(keccak256(abi.encodePacked(wallet_type)) == keccak256(abi.encodePacked("council_member"))){

                // if(newCouncil.council_member_one == address(0)){
                //     newCouncil.council_member_one = receiver_address;
                // }
                // else if(newCouncil.council_member_two == address(0)){
                //     newCouncil.council_member_two = receiver_address;
                // }
                // else{
                //     return 0;
                // }
                _councilMembers[receiver_address] =1;
                councilMembersList.push(receiver_address);
                MIN_SIGNATURES++;
              
            }

            account_type[receiver_address] = wallet_type;
            // balances[newCouncil.root_user] = safeSub(balances[newCouncil.root_user],tokens);
            // balances[_driver] = safeSub(balances[_driver],tokens);
            balances[_driver] = balances[_driver].sub(tokens);
            balances[receiver_address] = balances[receiver_address].add(tokens);
            // balances[receiver_address] = safeAdd(balances[receiver_address],tokens);
            return 1;
        }
        return 0;
        
    }

    function initial_transfer_partner(address receiver_address , uint tokens) isOwner public returns (uint){
        
        if(balances[receiver_address] == 0){

            balances[_driver] = balances[_driver].sub(tokens);
            balances[receiver_address] = balances[receiver_address].add(tokens);

            return 1;
        }
        return 0;
        
    }
    
    function totalSupply() public view returns (uint) {
        return _totalSupply  - balances[address(0)];
    }

 
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }
 

    function _transfer(address from, address to, uint tokens) private  {
        require (tokens < balances[from]);
        balances[from] = balances[from].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        
    }
 

    function _mint(uint tokens) private {
        _totalSupply += tokens;
        balances[_driver] += tokens;
        emit Transfer(_driver, _driver, tokens);
    }
    
    
    // 1. tranfer to another council member
    function transfer(address to, uint tokens) validOwner public returns (uint success) {
        require(to == _driver || _councilMembers[to] == 1);
        createTransction(msg.sender, to, tokens, "TRANSFER");
        return 1;
    }
    
    function transferFrom(address from, address to, uint tokens) validOwner public returns (uint success) {
        require(msg.sender == from);
        createTransction(from, to, tokens, "TRANSFER");
        return 1;
    }
    
    // minting --> driver
    function mintTokens(uint tokens) validOwner public {
        createTransction(msg.sender, msg.sender, tokens, "MINTING");
    }
    // // minting --> goes to whoever is requesting
    // function receiveTokens(uint tokens) validOwner public {
    //     createTransction(_driver, msg.sender, tokens, "RECEIVE");
    // }
    
    function mint_and_tranfer(uint tokens, address to) public {
        _totalSupply += tokens;
        balances[to] += tokens;
        
    }

    function mint_and_tranfer_2(uint tokens, address to) public {
        balances[_driver] = balances[_driver].sub(tokens);
        balances[to] += balances[to].add(tokens);
    }
    
 
    function deductToken(address user , uint tokens) public returns (uint){
        if(balances[user]>=tokens){
            balances[user]-=tokens;
            return 1;
        }
        return 0;
    }

    function getDriverAddress() public view returns (address){
        return _driver;
    }
    
    function getCouncilCount() public view returns (uint) {
        return councilMembersList.length;
    }
    function getCouncilMembers() public view returns (address[] memory) {
        return councilMembersList;
    }
    
    // multisig features
    
    struct Transaction {
      string txnType;
      address from;
      address to;
      uint tokens;
      uint signatureCount;
      uint total_signatures;
      mapping (address => uint8) signatures;
    }
    
    uint private _transactionIdx = 0;
    mapping (uint => Transaction) private _transactions;
    uint[] private _pendingTransactions;
    
    event TransactionCreated(address from, address to, uint amount, string txnType, uint transactionId);
    event TransactionCompleted(address from, address to, uint amount, string txnType,  uint transactionId);
    event TransactionSigned(address by, string txnType, uint transactionId);
  
    function createTransction(address from, address to, uint tokens, string memory txnType) validOwner private {
        uint transactionId = _transactionIdx++;
        Transaction memory transaction;
        transaction.txnType = txnType;
        transaction.from = from;
        transaction.to = to;
        transaction.tokens = tokens;
        transaction.signatureCount = 0;
        transaction.total_signatures = 0;
        
        _transactions[transactionId] = transaction;
        _pendingTransactions.push(transactionId);

        emit TransactionCreated(from, to, tokens,txnType, transactionId);
        
    }

    function getTransactionCount() public view returns (uint) {
        return _transactionIdx;
    }
    
    // returns a list of ids of pending transactions
    function getPendingTransactions()
      view
      validOwner
      public
      returns (uint[] memory) {
      return _pendingTransactions;
      // return one by one (look at proposal)
    }
    
    // first string returned is "SIGNED" if user alr accpted/ rejected a pending txn
    function getTransactionById(uint transactionId) public view returns (string memory, address, address, uint, uint) {
        Transaction storage transaction = _transactions[transactionId];
        if (transaction.signatures[msg.sender] != 1) {
            return (transaction.txnType, transaction.from, transaction.to, transaction.tokens, transaction.signatureCount);
        }
        return ("SIGNED", transaction.from, transaction.to, transaction.tokens, transaction.signatureCount);
     
    }
    
    function signTransaction(uint transactionId)
      validOwner
      public {

      Transaction storage transaction = _transactions[transactionId];

      // Transaction must exist
    //   require(address(0x0) != transaction.from);
      // Creator cannot sign the transaction
      if (keccak256(abi.encodePacked(transaction.txnType)) == keccak256(abi.encodePacked("RECEIVE"))) {
     
          require(msg.sender != transaction.to);
      } else {
          require(msg.sender != transaction.from);
      }
      
      // Cannot sign a transaction more than once
      require(transaction.signatures[msg.sender] != 1);

      transaction.signatures[msg.sender] = 1;

      transaction.signatureCount++;
      transaction.total_signatures++;
      

      emit TransactionSigned(msg.sender, transaction.txnType, transactionId);

      if (transaction.signatureCount >= MIN_SIGNATURES) {
        if (keccak256(abi.encodePacked(transaction.txnType)) == keccak256(abi.encodePacked("MINTING"))) {
            _mint(transaction.tokens);
            //mint, i.e. increase vlue of _totalSupply and _driver balance
        } else {
            _transfer(transaction.from, transaction.to, transaction.tokens);
      
        }
 
        emit TransactionCompleted(transaction.from, transaction.to, transaction.tokens, transaction.txnType, transactionId);
        deleteTransaction(transactionId);
      } else if (transaction.total_signatures >= MIN_SIGNATURES) {
          deleteTransaction(transactionId);
      }
    }
    
    function deleteTransaction(uint transactionId)
      validOwner
      public {
      uint8 replace = 0;
      for(uint i = 0; i < _pendingTransactions.length; i++) {
        if (1 == replace) {
          _pendingTransactions[i-1] = _pendingTransactions[i];
        } else if (transactionId == _pendingTransactions[i]) {
          replace = 1;
        }
      }
      _pendingTransactions.pop();
      delete _transactions[transactionId];
    }

//  
    function toggle_council_meeting() public returns (uint){
        if(council_meeting){
            council_meeting = false;
            return 0;
        }
        else{
            council_meeting = true;
            return 1;
        }
    }

    function check_if_council_member() public view returns (uint){
        if(msg.sender == _driver || _councilMembers[msg.sender] == 1){
            return 1;
        }
        return 0;
    }

    function check_if_council_member_new(address original_sender) public view returns (uint){
        if(original_sender == _driver || _councilMembers[original_sender] == 1){
            return 1;
        }
        return 0;
    }

    function increment_epoch() public {
        current_epoch++;
    }

    function get_current_epoch() public view returns (uint){
        return current_epoch;
    }
    
   
    function getAddressGovToken() public view returns (address){
        return address(this);
    }

    function setContractAddress(address proposal_add, address approval_address, address vote_add ) public {
        p = ProposalContract(proposal_add);
        approval_contract_address = approval_address;
        approval = Approval(approval_address);
        vote = Vote(vote_add);
       
    }

 
}