// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IMerkleClaim {
    event MerkleSet(bytes32 root);
    event Claim(address recipient, uint256 amount, address token, bytes data, string schema);

    function setMerkle(bytes32 _root) external;
}

abstract contract MerkleClaim is IMerkleClaim {
    using SafeERC20 for IERC20;
    bytes32 private root;
    mapping(bytes32 => mapping(address => bool)) private hasClaimed;

    function _setMerkle(bytes32 _root) internal virtual {
        root = _root;
        emit MerkleSet(root);
    }

    function _claim(
        bytes32 merkleRoot,
        bytes32[] memory proof,
        address recipient,
        uint256 amount,
        address token,
        bytes memory data,
        string memory schema
    ) internal virtual {
        require(!hasClaimed[merkleRoot][recipient], "Already claimed");
        hasClaimed[merkleRoot][recipient] = true;

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(token, recipient, amount))));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");
        IERC20(token).safeTransfer(recipient, amount);
        emit Claim(recipient, amount, token, data, schema);
    }
}