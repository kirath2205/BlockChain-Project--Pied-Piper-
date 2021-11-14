pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";

contract Auth {
    GovToken gt;
    struct Profile {
        string username;
        string password;
        string secret_phrase;
    }
    
    mapping(address => Profile[]) public profiles;
    mapping(address => uint) public number_of_profiles;

    string [] usernames;
    uint username_count = 0;
    
    event ProfileCreated(string username, address wallet_address);
    event PasswordUpdated(string username);
    event loginUnsuccessful(string username);
    
    function addProfile(string memory username , string memory password , string memory secret_phrase) public returns (uint){
        
        if(checkUsernameExists(username) ){
            return 0;
        }
        if(gt.check_if_council_member()==0 && number_of_profiles[msg.sender]!=0){
            return 0; // platform user with this account address already exists
        }
        profiles[msg.sender].push(Profile(username , password , secret_phrase));
        number_of_profiles[msg.sender]++;
        usernames.push(username);
        username_count = username_count+1;
        // give some tokens on registration,if it is a platform user
        gt.mint_and_tranfer(5, msg.sender);
        emit ProfileCreated(username , msg.sender);
        return 1;
    }

    
    function updatePassword(string memory username , string memory secret_phrase , string memory new_password) public returns (uint){
        
        uint loop_end = number_of_profiles[msg.sender];
        for(uint i=0 ; i<loop_end ; i=i+1){
            if(keccak256(abi.encodePacked(profiles[msg.sender][i].username)) == keccak256(abi.encodePacked(username)) && keccak256(abi.encodePacked(profiles[msg.sender][i].secret_phrase)) == keccak256(abi.encodePacked(secret_phrase))){
                profiles[msg.sender][i].password = new_password;
                emit PasswordUpdated(username);
                return 1;
            }
        }
        return 0;
    }
    
    function checkUsernameExists(string memory username) private view returns (bool){
        for(uint i=0; i < username_count ; i=i+1){
            if(keccak256(abi.encodePacked(usernames[i])) == keccak256(abi.encodePacked(username))){
                return true;
            }
        }
        return false;
    }
    
    function login(string memory username , string memory password) public view returns(uint){
        uint total_users = number_of_profiles[msg.sender];
        for(uint i=0; i<total_users ; i++){
            if(keccak256(abi.encodePacked(profiles[msg.sender][i].username)) == keccak256(abi.encodePacked(username)) && keccak256(abi.encodePacked(profiles[msg.sender][i].password)) == keccak256(abi.encodePacked(password))){
                
                return 1;
            }
        }
        return 0;
    }

    
}