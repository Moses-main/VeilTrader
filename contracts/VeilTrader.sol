// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VeilTrader
 * @notice Core trading contract for the VeilTrader agent
 * @dev Integrates with ERC-8004 identity registry
 */
contract VeilTrader {
    
    struct Trade {
        bytes32 actionHash;
        string actionType;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOut;
        uint256 timestamp;
        string metadata;
    }
    
    bytes32 public agentId;
    address public owner;
    
    Trade[] public trades;
    mapping(bytes32 => uint256) public tradeIndex;
    
    event TradeExecuted(
        bytes32 indexed actionHash,
        string actionType,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );
    
    event IdentityUpdated(bytes32 indexed agentId, string metadata);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor(bytes32 _agentId) {
        agentId = _agentId;
        owner = msg.sender;
    }
    
    function executeTrade(
        string memory _actionType,
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOut,
        string memory _metadata
    ) external onlyOwner returns (bytes32 actionHash) {
        
        actionHash = keccak256(abi.encodePacked(
            _actionType,
            _tokenIn,
            _tokenOut,
            _amountIn,
            block.timestamp
        ));
        
        Trade memory trade = Trade({
            actionHash: actionHash,
            actionType: _actionType,
            tokenIn: _tokenIn,
            tokenOut: _tokenOut,
            amountIn: _amountIn,
            amountOut: _amountOut,
            timestamp: block.timestamp,
            metadata: _metadata
        });
        
        trades.push(trade);
        tradeIndex[actionHash] = trades.length - 1;
        
        emit TradeExecuted(
            actionHash,
            _actionType,
            _tokenIn,
            _tokenOut,
            _amountIn,
            _amountOut,
            block.timestamp
        );
        
        return actionHash;
    }
    
    function getTrade(bytes32 _actionHash) external view returns (Trade memory) {
        uint256 index = tradeIndex[_actionHash];
        require(index < trades.length, "Trade not found");
        return trades[index];
    }
    
    function getAllTrades() external view returns (Trade[] memory) {
        return trades;
    }
    
    function getTradeCount() external view returns (uint256) {
        return trades.length;
    }
    
    function updateIdentity(string memory _metadata) external onlyOwner {
        emit IdentityUpdated(agentId, _metadata);
    }
    
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
}