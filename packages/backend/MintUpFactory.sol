// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MintUpFactory (USDC-only)
 * - Prices are in USDC smallest unit (usually 6 decimals)
 * - Token IDs: upper 128 bits = eventId, lower 128 bits = ticketIndex
 * - Uses SafeERC20 and ReentrancyGuard
 */
contract MintUpFactory is ERC1155, Ownable, ReentrancyGuard {
  using SafeERC20 for IERC20;

  IERC20 public immutable usdcToken;

  uint256 private constant TYPE_BITS = 128;
  uint256 private constant TYPE_MASK = (uint256(1) << TYPE_BITS) - 1;

  struct TicketParams {
    uint256 priceUSDC;
    uint256 maxSupply; // 0 for unlimited
    string metadataURI;
  }

  struct TicketDetails {
    uint256 priceUSDC;
    uint256 maxSupply;
    uint256 mintedSupply;
    string metadataURI;
  }

  struct EventInfo {
    address organizer;
    uint256 ticketTypeCount;
  }

  uint256 public _nextEventId;

  mapping(uint256 => EventInfo) public eventInfo;         // eventId => eventInfo
  mapping(uint256 => TicketDetails) public ticketDetails; // eventId => ticketDetails
  mapping(uint256 => uint256) public pendingUSDC;         // organizer => amount

  event EventCreated(uint256 indexed eventId, address indexed organizer, uint256 ticketCount);
  event TicketCreated(
    uint256 indexed tokenId,
    uint256 indexed eventId,
    uint256 indexed ticketIndex,
    uint256 priceUSDC,
    uint256 maxSupply
  );
  event TicketMinted(
    uint256 indexed tokenId,
    address indexed buyer,
    uint256 indexed organizer
  );
  event WithdrawUSDC(address indexed to, uint256 amount);

  constructor(address initialOwner, address _usdcContractAddress) ERC1155("") {
    require(_usdcContractAddress != address(0), "Invalid USDC address");
    usdcToken = IERC20(_usdcContractAddress);
    _nextEventId = 1;
    _transferOwnership(initialOwner);
  }

  function createEventWithTickets(
    address _organizer,
    TicketParams[] calldata _tickets
  ) external onlyOwner returns (uint256) {
    require(_organizer != address(0), "Invalid organizer address");
    require(_tickets.length > 0, "At least one ticket is required");
  }
}