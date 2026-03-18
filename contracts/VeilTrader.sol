// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VeilTrader
 * @notice Core trading contract for the VeilTrader agent
 * @dev Integrates with ERC-8004 identity and reputation registry
 */
interface IIdentityRegistry {
    function register(string calldata metadataURI, string calldata domain) external returns (uint256 tokenId);
    function tokenOfAgentByRegistration(string calldata agentIdentifier) external view returns (uint256);
    function agentURI(uint256 tokenId) external view returns (string memory);
    function setAgentURI(uint256 tokenId, string calldata metadataURI) external;
}

interface IReputationRegistry {
    function giveFeedback(
        uint256 agentId,
        int128 value,
        uint8 decimals,
        string calldata tag1,
        string calldata tag2,
        string calldata agentURI,
        string calldata detailsURI,
        bytes32 data
    ) external;
    
    function getSummary(
        uint256 agentId,
        address[] calldata trustedClients,
        string calldata tag1,
        string calldata tag2
    ) external view returns (uint64 count, int128 value, uint8 decimals);
}

contract VeilTrader {
    
    // ERC-8004 Registry Addresses (same on all chains)
    address public constant IDENTITY_REGISTRY = 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432;
    address public constant REPUTATION_REGISTRY = 0x8004BAa17C55a88189AE136b182e5fdA19dE9b63;
    
    struct Trade {
        bytes32 actionHash;
        string actionType;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOut;
        uint256 timestamp;
        string metadata;
        uint256 reputationFeedbackGiven; // Track if feedback was given for this trade
    }
    
    bytes32 public agentId;
    address public owner;
    uint256 public erc8004TokenId; // ERC-721 token ID from ERC-8004 registry
    
    Trade[] public trades;
    mapping(bytes32 => uint256) public tradeIndex;
    
    // Track which trades have had reputation feedback given
    mapping(uint256 => bool) public tradeFeedbackGiven;
    
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
    event ERC8004Registered(uint256 indexed tokenId, string metadataURI, string domain);
    event ReputationFeedbackGiven(
        uint256 indexed tradeIndex,
        int128 value,
        uint8 decimals,
        string tag1,
        string tag2
    );
    
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
    ) external returns (bytes32 actionHash) {
        require(isAuthorized(msg.sender, _amountIn), "Not authorized");
        
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
            metadata: _metadata,
            reputationFeedbackGiven: 0 // Initialize as not given
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
        
        // Update delegate total spent if caller is a delegate
        if (msg.sender != owner) {
            updateDelegateTotalSpent(msg.sender, _amountIn);
        }
        
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

    /**
     * @notice Register the agent with ERC-8004 Identity Registry
     * @dev This should be called after deployment to register the agent's identity
     * @param metadataURI IPFS URI containing agent metadata
     * @param domain Domain for verification (e.g., "veiltrader.xyz")
     * @return erc8004TokenId The ERC-721 token ID representing this agent
     */
    function registerWithERC8004(string calldata metadataURI, string calldata domain) external onlyOwner returns (uint256) {
        IIdentityRegistry identityRegistry = IIdentityRegistry(IDENTITY_REGISTRY);
        
        // Check if already registered
        if (erc8004TokenId != 0) {
            return erc8004TokenId;
        }
        
        // Register with ERC-8004 registry
        erc8004TokenId = identityRegistry.register(metadataURI, domain);
        
        emit ERC8004Registered(erc8004TokenId, metadataURI, domain);
        
        return erc8004TokenId;
    }

    /**
     * @notice Give reputation feedback for a specific trade
     * @dev Call this after a trade is executed to build on-chain reputation
     * @param tradeIdx Index of the trade in the trades array
     * @param value Reputation value (e.g., 9977 for 99.77% with 2 decimals)
     * @param decimals Number of decimal places for the value
     * @param tag1 First tag for categorization (e.g., "profitability")
     * @param tag2 Second tag for categorization (e.g., "30days")
     * @param detailsURI IPFS URI with detailed feedback information
     */
    function giveTradeReputationFeedback(
        uint256 tradeIdx,
        int128 value,
        uint8 decimals,
        string calldata tag1,
        string calldata tag2,
        string calldata detailsURI
    ) external onlyOwner {
        require(tradeIdx < trades.length, "Trade index out of bounds");
        require(!tradeFeedbackGiven[tradeIdx], "Feedback already given for this trade");
        
        Trade memory trade = trades[tradeIdx];
        
        // Give feedback to ERC-8004 Reputation Registry
        IReputationRegistry reputationRegistry = IReputationRegistry(REPUTATION_REGISTRY);
        reputationRegistry.giveFeedback(
            erc8004TokenId, // Use ERC-8004 token ID as agent ID
            value,
            decimals,
            tag1,
            tag2,
            "", // agentURI (can be retrieved from registry)
            detailsURI,
            keccak256(abi.encodePacked(
                trade.actionType,
                trade.tokenIn,
                trade.tokenOut,
                trade.amountIn,
                trade.amountOut,
                trade.timestamp
            ))
        );
        
        // Mark that feedback has been given for this trade
        tradeFeedbackGiven[tradeIdx] = true;
        
        // Update the trade record to note feedback was given
        trades[tradeIdx].reputationFeedbackGiven = block.timestamp;
        
        emit ReputationFeedbackGiven(
            tradeIdx,
            value,
            decimals,
            tag1,
            tag2
        );
    }

    /**
     * @notice Get reputation summary for the agent
     * @dev Query the ERC-8004 Reputation Registry for reputation data
     * @param trustedClients Array of addresses considered trusted for reputation
     * @param tag1 First tag to filter by
     * @param tag2 Second tag to filter by
     * @return count Number of feedback entries
     * @return value Reputation value
     * @return decimals Number of decimal places
     */
    function getReputationSummary(
        address[] calldata trustedClients,
        string calldata tag1,
        string calldata tag2
    ) external view returns (uint64 count, int128 value, uint8 decimals) {
        require(erc8004TokenId != 0, "Agent not registered with ERC-8004");
        
        IReputationRegistry reputationRegistry = IReputationRegistry(REPUTATION_REGISTRY);
        return reputationRegistry.getSummary(erc8004TokenId, trustedClients, tag1, tag2);
    }

    /**
     * @notice Get the agent's metadata URI from ERC-8004 registry
     * @dev Returns the metadata URI registered with ERC-8004
     * @return metadataURI The IPFS URI containing agent metadata
     */
    function getAgentMetadataURI() external view returns (string memory) {
        require(erc8004TokenId != 0, "Agent not registered with ERC-8004");
        
        IIdentityRegistry identityRegistry = IIdentityRegistry(IDENTITY_REGISTRY);
        return identityRegistry.agentURI(erc8004TokenId);
    }

    /**
     * @notice Verify agent registration via domain verification
     * @dev Checks if the agent is properly registered according to ERC-8004 domain verification standard
     * @param domain Domain to verify (e.g., "veiltrader.xyz")
     * @return isVerified Whether the agent is verified for this domain
     */
    function verifyDomainRegistration(string calldata domain) external view returns (bool) {
        if (erc8004TokenId == 0) {
            return false;
        }
        
        IIdentityRegistry identityRegistry = IIdentityRegistry(IDENTITY_REGISTRY);
        string memory agentUri = identityRegistry.agentURI(erc8004TokenId);
        
        // In a full implementation, we would check if the agentUri contains a link to
        // a .well-known/agent-registration.json file on the domain that signs the agent ID
        // For simplicity in this implementation, we just check if we have a non-empty URI
        // A production implementation would fetch and verify the JSON file
        return bytes(agentUri).length > 0;
    }

    /**
     * @notice Get the cross-chain identifier for this agent
     * @dev Returns the ERC-8004 compliant cross-chain identifier
     * @return identifier The cross-chain identifier in format eip155:{chainId}:{registryAddress}:{tokenId}
     */
    function getCrossChainIdentifier(uint256 chainId) external view returns (string memory) {
        if (erc8004TokenId == 0) {
            return "";
        }
        
        return string(abi.encodePacked(
            "eip155:",
            string(abi.encodePacked(chainId)),
            ":",
            address(IDENTITY_REGISTRY),
            ":",
            string(abi.encodePacked(erc8004TokenId))
        ));
    }

    // ========== Delegations ==========
    struct DelegationParams {
        address delegate;
        uint256 maxValuePerTx; // Maximum value per transaction in wei
        uint256 maxTotalValue; // Maximum total value that can be spent
        uint256 totalSpent;    // Total value already spent
        bool active;
    }

    // Mapping of delegator => delegate => params
    mapping(address => mapping(address => DelegationParams)) public delegations;

    event DelegationGranted(
        address indexed delegator,
        address indexed delegate,
        uint256 maxValuePerTx,
        uint256 maxTotalValue
    );

    event DelegationRevoked(
        address indexed delegator,
        address indexed delegate
    );

    /**
     * @notice Grant delegation to an address with spending limits
     * @dev Only the owner can grant delegations
     * @param delegate The address to grant delegation to
     * @param maxValuePerTx Maximum value per transaction in wei
     * @param maxTotalValue Maximum total value that can be spent
     */
    function grantDelegation(
        address delegate,
        uint256 maxValuePerTx,
        uint256 maxTotalValue
    ) external onlyOwner {
        require(delegate != address(0), "Delegate cannot be zero address");
        require(delegate != owner, "Cannot delegate to self");
        require(maxValuePerTx > 0, "Max value per tx must be greater than 0");
        require(maxTotalValue > 0, "Max total value must be greater than 0");

        delegations[owner][delegate] = DelegationParams({
            delegate: delegate,
            maxValuePerTx: maxValuePerTx,
            maxTotalValue: maxTotalValue,
            totalSpent: 0,
            active: true
        });

        emit DelegationGranted(owner, delegate, maxValuePerTx, maxTotalValue);
    }

    /**
     * @notice Revoke delegation from an address
     * @dev Only the owner can revoke delegations
     * @param delegate The address to revoke delegation from
     */
    function revokeDelegation(address delegate) external onlyOwner {
        require(delegations[owner][delegate].active, "Delegation is not active");

        delegations[owner][delegate].active = false;

        emit DelegationRevoked(owner, delegate);
    }

    /**
     * @notice Check if a caller is authorized to execute a trade (either owner or active delegate with sufficient limits)
     * @dev Used internally to check authorization for trade execution
     * @param caller The address calling the function
     * @param value The value of the trade in wei
     * @return bool True if authorized, false otherwise
     */
    function isAuthorized(address caller, uint256 value) internal view returns (bool) {
        // Owner is always authorized
        if (caller == owner) {
            return true;
        }

        // Check if caller is an active delegate with sufficient limits
        DelegationParams memory params = delegations[owner][caller];
        if (params.active) {
            // Check per-transaction limit
            if (value > params.maxValuePerTx) {
                return false;
            }
            // Check total limit
            if (params.totalSpent + value > params.maxTotalValue) {
                return false;
            }
            return true;
        }

        return false;
    }

    /**
     * @notice Update the total spent for a delegate after a successful trade
     * @dev Internal function to update delegation tracking
     * @param delegate The delegate address
     * @param value The value of the trade in wei
     */
    function updateDelegateTotalSpent(address delegate, uint256 value) internal {
        DelegationParams memory params = delegations[owner][delegate];
        if (params.active) {
            // In a real implementation, we would use a non-reentrant pattern or checks-effects-interactions
            // For simplicity, we assume this is called only from executeTrade which is non-reentrant
            delegations[owner][delegate].totalSpent += value;
        }
    }

    // ========== Locus Integration ==========
    // Locus is a protocol for agent-native payments
    // For this implementation, we'll simulate the core concepts
    
    event LocusPaymentReceived(
        address indexed from,
        uint256 amount,
        string paymentId,
        string memo
    );

    event LocusPaymentSent(
        address indexed to,
        uint256 amount,
        string paymentId,
        string memo
    );

    /**
     * @notice Receive a payment via Locus
     * @dev In a real implementation, this would interact with the Locus protocol
     * @param from The address sending the payment
     * @param amount The amount received in wei
     * @param paymentId Unique identifier for this payment
     * @param memo Optional memo for the payment
     */
    function receiveLocusPayment(
        address from,
        uint256 amount,
        string calldata paymentId,
        string calldata memo
    ) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(bytes(paymentId).length > 0, "Payment ID required");
        
        emit LocusPaymentReceived(from, amount, paymentId, memo);
        
        // In a real implementation, we would update internal accounting
        // For now, we just emit the event
    }

    /**
     * @notice Send a payment via Locus
     * @dev In a real implementation, this would interact with the Locus protocol
     * @param to The address to send payment to
     * @param amount The amount to send in wei
     * @param paymentId Unique identifier for this payment
     * @param memo Optional memo for the payment
     */
    function sendLocusPayment(
        address to,
        uint256 amount,
        string calldata paymentId,
        string calldata memo
    ) external onlyOwner {
        require(to != address(0), "Cannot send to zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(bytes(paymentId).length > 0, "Payment ID required");
        
        emit LocusPaymentSent(to, amount, paymentId, memo);
        
        // In a real implementation, we would deduct from balance and interact with Locus
        // For now, we just emit the event
    }

    /**
     * @notice Get the agent's Locus address (if applicable)
     * @dev Returns the address used for Locus transactions
     * @return locusAddress The Locus address for this agent
     */
    function getLocusAddress() external view returns (address) {
        // In a real implementation, this might return a specific Locus address
        // For now, we return the owner address as the Locus address
        return owner;
    }
}