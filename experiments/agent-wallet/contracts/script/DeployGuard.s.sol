// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {AgentScoopeModuleGuard} from "../src/AgentScoopeModuleGuard.sol";

/// @notice Deploy AgentScoopeModuleGuard to Sepolia.
/// env: SEPOLIA_RPC_URL, DEPLOYER_PRIVATE_KEY
/// optional: GUARD_RECIPIENTS (comma-separated), GUARD_EXPIRES_AT (unix timestamp)
contract DeployGuard is Script {
    address constant ALLOWANCE_MODULE = 0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134;
    address constant SEPOLIA_USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;

    function run() external returns (address guard) {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address[] memory recipients = _readRecipients();
        uint256 expiresAt = vm.envOr("GUARD_EXPIRES_AT", block.timestamp + 365 days);

        vm.startBroadcast(deployerKey);
        guard = address(
            new AgentScoopeModuleGuard(ALLOWANCE_MODULE, SEPOLIA_USDC, recipients, expiresAt)
        );
        vm.stopBroadcast();

        console2.log("AgentScoopeModuleGuard deployed at:", guard);
        console2.log("Set on Safe via setModuleGuard(guard)");
    }

    function _readRecipients() internal view returns (address[] memory) {
        string memory raw = vm.envOr("GUARD_RECIPIENTS", string(""));
        if (bytes(raw).length == 0) {
            address[] memory empty = new address[](0);
            return empty;
        }
        // Single recipient for MVP; extend if needed
        address[] memory r = new address[](1);
        r[0] = vm.parseAddress(raw);
        return r;
    }
}
