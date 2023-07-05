// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Hedera/SafeHederaTokenService.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Swapper is SafeHederaTokenService, Ownable, Pausable, AccessControl {
    bytes32 public constant WHITELISTED_ROLE = keccak256("WHITELISTED_ROLE");

    IERC20 public usdc;
    IERC20 public barrage;
    address public admin;

    constructor(address _usdc, address _barrage) {
        usdc = IERC20(_usdc);
        barrage = IERC20(_barrage);
        admin = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    function approveSpender(address token, address spender, uint256 amount) public onlyAdmin whenNotPaused {
        safeApprove(token, spender, amount);
    }

    function associateToken(address token) public onlyAdmin whenNotPaused {
        safeAssociateToken(address(this), token);
    }

    function deposit(uint256 amount) external onlyAdmin whenNotPaused {
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    function getBalanceUSDC() external view onlyAdmin whenNotPaused returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    function getAmountForWithdraw() external view whenNotPaused returns (uint256) {
        require(hasRole(WHITELISTED_ROLE, msg.sender), "Only whitelisted addresses can call this function");
        return barrage.balanceOf(msg.sender);
    }

    function removeWhitelistedAddress(address _address) external onlyAdmin whenNotPaused {
        revokeRole(WHITELISTED_ROLE, _address);
    }

    function stop() external onlyAdmin whenNotPaused {
        uint256 balance = usdc.balanceOf(address(this));
        require(usdc.transferFrom(address(this), msg.sender, balance), "Transfer failed");
        _pause();
    }

    function swap(uint256 amount) external whenNotPaused {
        require(hasRole(WHITELISTED_ROLE, msg.sender), "Only whitelisted addresses can call this function");
        require(barrage.transferFrom(msg.sender, admin, amount), "Transfer failed");
        require(usdc.transferFrom(address(this), msg.sender, amount), "Transfer failed");
    }

    function whitelistAddress(address _address) external onlyAdmin whenNotPaused {
        grantRole(WHITELISTED_ROLE, _address);
    }
}
