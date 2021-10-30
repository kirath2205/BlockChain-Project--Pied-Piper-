pragma solidity >=0.4.21 <0.7.0;

import "./GovToken.sol";


contract MultiSigWallet is GovToken {

    address private _driver;
    mapping(address => uint8) private _councilMembers;

    // uint constant MIN_SIGNATURES = 2;
    uint private MIN_SIGNATURES =0;
    uint private _transactionIdx;

    struct Transaction {
      string txnType;
      address from;
      address to;
      uint tokens;
      uint8 signatureCount;
      mapping (address => uint8) signatures;
    }

    mapping (uint => Transaction) private _transactions;
    uint[] private _pendingTransactions;

    modifier isOwner() {
        require(msg.sender == _driver);
        _;
    }

    modifier validOwner() {
        require(msg.sender == _driver || _councilMembers[msg.sender] == 1);
        _;
    }

    // event DepositFunds(address from, uint amount);
    event TransactionCreated(address from, address to, uint amount, string txnType, uint transactionId);
    event TransactionCompleted(address from, address to, uint amount, string txnType,  uint transactionId);
    event TransactionSigned(address by, string txnType, uint transactionId);

    constructor(string memory _name, string memory _symbol , uint _supply) GovToken(_name, _symbol, _supply)
        public {
        _driver = msg.sender;
    }

    function addOwner(address owner)
        isOwner
        public {
        _councilMembers[owner] = 1;
        MIN_SIGNATURES++;
    }

    function removeOwner(address owner)
        isOwner
        public {
        _councilMembers[owner] = 0;
    }

    // function deposit()
    //     public
    //     payable {
    //     emit DepositFunds(msg.sender, msg.value);
    // }
    
    function mintTokens(uint tokens) isOwner public {
        createTransction(msg.sender, msg.sender, tokens, "MINTING");
    }
    
    function receiveTokens(uint tokens) validOwner public {
        createTransction(_driver, msg.sender, tokens, "RECEIVE");
    }
    
    function transferTo(address to, uint tokens) validOwner public  {
        createTransction(msg.sender, to, tokens, "TRANSFER");
    }
    // function withdraw(uint amount)
    //     public {
    //     transferTo(msg.sender, amount);
    // }
    
    function createTransction(address from, address to, uint tokens, string memory txnType) validOwner private {
        uint transactionId = _transactionIdx++;
        Transaction memory transaction;
        transaction.txnType = txnType;
        transaction.from = from;
        transaction.to = to;
        transaction.tokens = tokens;
        transaction.signatureCount = 0;
        
        _transactions[transactionId] = transaction;
        _pendingTransactions.push(transactionId);

        emit TransactionCreated(from, to, tokens,txnType, transactionId);
        
    }

    // function transferTo(address to, uint amount, string memory txnType)
    //     validOwner
    //     public {
    //     // require(address(this).balance >= amount);
    //     uint transactionId = _transactionIdx++;

    //     Transaction memory transaction;
    //     transaction.from = msg.sender;
    //     transaction.to = to;
    //     transaction.amount = amount;
    //     transaction.signatureCount = 0;

    //     _transactions[transactionId] = transaction;
    //     _pendingTransactions.push(transactionId);

    //     emit TransactionCreated(msg.sender, to, amount, transactionId);
    // }

    function getPendingTransactions()
      view
      validOwner
      public
      returns (uint[] memory) {
      return _pendingTransactions;
    }

    function signTransaction(uint transactionId)
      validOwner
      public {

      Transaction storage transaction = _transactions[transactionId];

      // Transaction must exist
      require(address(0x0) != transaction.from);
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

      emit TransactionSigned(msg.sender, transaction.txnType, transactionId);

      if (transaction.signatureCount >= MIN_SIGNATURES) {
        if (keccak256(abi.encodePacked(transaction.txnType)) == keccak256(abi.encodePacked("MINTING"))) {
      
            mint(transaction.to, transaction.tokens);
            //mint, i.e. increase vlue of _totalSupply and _driver balance
        } else {
            transferFrom(transaction.from, transaction.to, transaction.tokens);
            
            //transfer tokens from transaction.from to transaction.to
            // receive, i.e. transfer tokens from _driver to transaction.to
        }
          
          
        // require(address(this).balance >= transaction.amount);
        // transaction.to.transfer(transaction.amount);
        TransactionCompleted(transaction.from, transaction.to, transaction.tokens, transaction.txnType, transactionId);
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
    //   delete _pendingTransactions[_pendingTransactions.length - 1];
    //   _pendingTransactions.length--;
      delete _transactions[transactionId];
    }

    // function walletBalance()
    //   view
    //   public
    //   returns (uint) {
    //   return address(this).balance;
    // }
}