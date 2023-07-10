// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

import "./HederaTokenService.sol";

abstract contract SafeHederaTokenService is HederaTokenService {
    function safeAssociateToken(address account, address token) internal {
        int256 responseCode;
        (responseCode) = HederaTokenService.associateToken(account, token);
        require(responseCode == HederaResponseCodes.SUCCESS, "Safe single association failed!");
    }
}
