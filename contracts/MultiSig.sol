pragma solidity >=0.4.21 <0.7.0;


// change the transfer functions to allow for transfer of tokens instead of eth
// to add: -- mining, receiving tokens
contract MultiSigWallet {

    address private _owner;
    mapping(address => uint8) private _owners;

    // uint constant MIN_SIGNATURES = 2;
    uint private MIN_SIGNATURES =0;
    uint private _transactionIdx;

    struct Transaction {
      address from;
      address to;
      uint amount;
      uint8 signatureCount;
      mapping (address => uint8) signatures;
    }

    mapping (uint => Transaction) private _transactions;
    uint[] private _pendingTransactions;

    modifier isOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier validOwner() {
        require(msg.sender == _owner || _owners[msg.sender] == 1);
        _;
    }

    event DepositFunds(address from, uint amount);
    event TransactionCreated(address from, address to, uint amount, uint transactionId);
    event TransactionCompleted(address from, address to, uint amount, uint transactionId);
    event TransactionSigned(address by, uint transactionId);

    function MultiSigWallet()
        public {
        _owner = msg.sender;
    }

    function addOwner(address owner)
        isOwner
        public {
        _owners[owner] = 1;
        MIN_SIGNATURES++;
    }

    function removeOwner(address owner)
        isOwner
        public {
        _owners[owner] = 0;
    }

    function ()
        public
        payable {
        DepositFunds(msg.sender, msg.value);
    }

    function withdraw(uint amount)
        public {
        transferTo(msg.sender, amount);
    }

    function transferTo(address to, uint amount)
        validOwner
        public {
        require(address(this).balance >= amount);
        uint transactionId = _transactionIdx++;

        Transaction memory transaction;
        transaction.from = msg.sender;
        transaction.to = to;
        transaction.amount = amount;
        transaction.signatureCount = 0;

        _transactions[transactionId] = transaction;
        _pendingTransactions.push(transactionId);

        TransactionCreated(msg.sender, to, amount, transactionId);
    }

    function getPendingTransactions()
      view
      validOwner
      public
      returns (uint[]) {
      return _pendingTransactions;
    }

    function signTransaction(uint transactionId)
      validOwner
      public {

      Transaction storage transaction = _transactions[transactionId];

      // Transaction must exist
      require(0x0 != transaction.from);
      // Creator cannot sign the transaction
      require(msg.sender != transaction.from);
      // Cannot sign a transaction more than once
      require(transaction.signatures[msg.sender] != 1);

      transaction.signatures[msg.sender] = 1;
      transaction.signatureCount++;

      TransactionSigned(msg.sender, transactionId);

      if (transaction.signatureCount >= MIN_SIGNATURES) {
        require(address(this).balance >= transaction.amount);
        transaction.to.transfer(transaction.amount);
        TransactionCompleted(transaction.from, transaction.to, transaction.amount, transactionId);
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
      delete _pendingTransactions[_pendingTransactions.length - 1];
      _pendingTransactions.length--;
      delete _transactions[transactionId];
    }

    function walletBalance()
      constant
      public
      returns (uint) {
      return address(this).balance;
    }
}