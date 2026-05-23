// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModuleGuard} from "@safe/base/ModuleManager.sol";
import {Enum} from "@safe/interfaces/Enum.sol";

/**
 * @title AgentScoopeModuleGuard
 * @notice Module Guard for Safe + Allowance Module: enforces token, transfer-only, recipient whitelist, expiry.
 * @dev Hooked on execTransactionFromModule when AllowanceModule transfers ERC20 from the Safe.
 */
contract AgentScoopeModuleGuard is BaseModuleGuard {
    bytes4 private constant TRANSFER_SELECTOR = 0xa9059cbb;

    address public immutable allowanceModule;
    address public allowedToken;
    uint256 public expiresAt;
    address public owner;

    mapping(address => bool) public whitelistedRecipients;

    event RecipientUpdated(address indexed recipient, bool allowed);
    event ExpiresAtUpdated(uint256 expiresAt);
    event AllowedTokenUpdated(address indexed token);

    error OnlyOwner();
    error OnlyAllowanceModule();
    error InvalidOperation();
    error NonZeroValue();
    error TokenNotAllowed();
    error MethodNotAllowed();
    error TransferToUnlistedAddress();
    error PolicyExpired();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor(
        address _allowanceModule,
        address _allowedToken,
        address[] memory _initialRecipients,
        uint256 _expiresAt
    ) {
        allowanceModule = _allowanceModule;
        allowedToken = _allowedToken;
        expiresAt = _expiresAt;
        owner = msg.sender;

        for (uint256 i = 0; i < _initialRecipients.length; i++) {
            whitelistedRecipients[_initialRecipients[i]] = true;
            emit RecipientUpdated(_initialRecipients[i], true);
        }
    }

    function setRecipient(address recipient, bool allowed) external onlyOwner {
        whitelistedRecipients[recipient] = allowed;
        emit RecipientUpdated(recipient, allowed);
    }

    function setExpiresAt(uint256 _expiresAt) external onlyOwner {
        expiresAt = _expiresAt;
        emit ExpiresAtUpdated(_expiresAt);
    }

    function setAllowedToken(address token) external onlyOwner {
        allowedToken = token;
        emit AllowedTokenUpdated(token);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function checkModuleTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        address module
    ) external override returns (bytes32 moduleTxHash) {
        if (module != allowanceModule) revert OnlyAllowanceModule();
        if (operation != Enum.Operation.Call) revert InvalidOperation();
        if (value != 0) revert NonZeroValue();
        if (to != allowedToken) revert TokenNotAllowed();
        if (block.timestamp > expiresAt) revert PolicyExpired();

        if (data.length < 4) revert MethodNotAllowed();
        bytes4 selector;
        assembly {
            selector := mload(add(data, 32))
        }
        if (selector != TRANSFER_SELECTOR) revert MethodNotAllowed();

        (address recipient,) = abi.decode(_slice(data, 4), (address, uint256));
        if (!whitelistedRecipients[recipient]) revert TransferToUnlistedAddress();

        return bytes32(0);
    }

    function checkAfterModuleExecution(bytes32, bool) external pure override {
        // No post-check required for v0.2
    }

    function _slice(bytes memory data, uint256 start) private pure returns (bytes memory) {
        require(data.length >= start, "slice overflow");
        bytes memory result = new bytes(data.length - start);
        for (uint256 i = 0; i < result.length; i++) {
            result[i] = data[i + start];
        }
        return result;
    }
}
