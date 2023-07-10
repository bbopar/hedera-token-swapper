// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Hedera/SafeHederaTokenService.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Swapper contract
 * @dev Swapper contract that inherits from SafeHederaTokenService, Ownable, Pausable, and AccessControl contracts.
 */
contract Swapper is SafeHederaTokenService, Ownable, Pausable, AccessControl {
    // Defining a constant for the WHITELISTED_ROLE using keccak256 hash function
    bytes32 public constant WHITELISTED_ROLE = keccak256("WHITELISTED_ROLE");

    // Defining public state variables for the USDC and Barrage tokens and the admin address
    IERC20 public usdc;
    IERC20 public barrage;
    address public admin;

    /**
     * @dev Constructor function that sets the initial values for the USDC and Barrage tokens and the admin address.
     * @param _usdc Address of the USDC token contract.
     * @param _barrage Address of the Barrage token contract.
     */
    constructor(address _usdc, address _barrage) {
        usdc = IERC20(_usdc);
        barrage = IERC20(_barrage);
        admin = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    event Swapped(address indexed from, address indexed to, uint amount);
    event Deposited(address indexed from, address indexed to, uint amount);
    event Stopped(address indexed admin, uint amount);

    /**
     * @dev Modifier that requires the caller to have the DEFAULT_ADMIN_ROLE.
     */
    modifier onlyAdmin() {
       require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "You must be an admin to call this function");
        _;
    }

    /**
     * @dev Modifier that requires the caller to have the WHITELISTED_ROLE.
     */
    modifier onlyWhitelisted() {
        require(hasRole(WHITELISTED_ROLE, msg.sender), "Only whitelisted addresses can call this function");
        _;
    }

    /**
     * @dev Function that associates a token with the contract.
     * @param _token Address of the token contract.
     */
    function associateToken(address _token) public onlyAdmin whenNotPaused {
        safeAssociateToken(address(this), _token);
    }

    /**
     * @dev Function that allows the admin to deposit USDC tokens into the contract.
     * @param _amount Amount of USDC tokens to be deposited.
     */
    function deposit(uint256 _amount) external onlyAdmin whenNotPaused {
        require(usdc.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        emit Deposited(msg.sender, address(this), _amount);
    }

    /**
     * @dev Function that returns the balance of USDC tokens held by the contract.
     * @return uint256 Balance of USDC tokens held by the contract.
     */
    function getBalanceUSDC() external view onlyAdmin whenNotPaused returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    /**
     * @dev Function that returns the amount of Barrage tokens that a whitelisted address can withdraw.
     * @return uint256 Amount of Barrage tokens that can be withdrawn.
     */
    function getAmountForWithdraw() external view onlyWhitelisted whenNotPaused returns (uint256) {
        return barrage.balanceOf(msg.sender);
    }

    /**
     * @dev Function that allows the admin to grant the DEFAULT_ADMIN_ROLE to an address.
     * @param _address Address to be granted the DEFAULT_ADMIN_ROLE.
     */
    function grantAdminRole(address _address) external onlyAdmin whenNotPaused {
        grantRole(DEFAULT_ADMIN_ROLE, _address);
    }

    /**
     * @dev Function that allows the admin to remove an address from the whitelist.
     * @param _address Address to be removed from the whitelist.
     */
    function removeWhitelistedAddress(address _address) external onlyAdmin whenNotPaused {
        revokeRole(WHITELISTED_ROLE, _address);
    }

    /**
     * @dev Function that allows the admin to revoke the DEFAULT_ADMIN_ROLE from an address.
     * @param _address Address to have the DEFAULT_ADMIN_ROLE revoked.
     */
    function revokeAdminRole(address _address) external onlyAdmin whenNotPaused {
        revokeRole(DEFAULT_ADMIN_ROLE, _address);
    }

    /**
     * @dev Function that allows the admin to stop the contract and withdraw all USDC tokens held by the contract.
     */
    function stop() external onlyAdmin whenNotPaused {
        uint256 balance = usdc.balanceOf(address(this));
        require(usdc.transfer(admin, balance), "Transfer failed");
        _pause();
        emit Stopped(admin, balance);
    }

    /**
     * @dev Function that allows a whitelisted address to swap their Barrage tokens for USDC tokens at a 1:1 ratio.
     */    
    function swap() external onlyWhitelisted whenNotPaused {
        uint256 balance = barrage.balanceOf(msg.sender);
        require(barrage.transferFrom(msg.sender, admin, balance), "Transfer failed");
        require(usdc.transfer(msg.sender, balance), "Transfer failed");
        emit Swapped(address(this), msg.sender, balance);
    }

    /**
     * @dev Function that allows the admin to add an address to the whitelist.
     * @param _address Address to be added to the whitelist.
     */
    function whitelistAddress(address _address) external onlyAdmin whenNotPaused {
        grantRole(WHITELISTED_ROLE, _address);
    }
}
