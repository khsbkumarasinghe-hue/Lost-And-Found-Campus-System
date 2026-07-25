package com.uoc.lostandfound.service;

import com.uoc.lostandfound.model.Claim;
import com.uoc.lostandfound.model.ClaimStatus;
import com.uoc.lostandfound.repository.ClaimRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;

    public ClaimService(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    // CREATE: submit a new claim
    public Claim createClaim(Claim claim) {
        validateClaimInput(claim);

        boolean duplicateClaim =
                claimRepository.existsByItemIdAndClaimantId(
                        claim.getItemId(),
                        claim.getClaimantId()
                );

        if (duplicateClaim) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This user has already submitted a claim for this item"
            );
        }

        claim.setId(null);
        claim.setStatus(ClaimStatus.PENDING);
        claim.setCreatedAt(null);

        return claimRepository.save(claim);
    }

    // READ: view all claims
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    // READ: view one claim
    public Claim getClaimById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Claim not found with ID: " + id
                ));
    }

    // READ: view claims submitted by a user
    public List<Claim> getClaimsByClaimant(Long claimantId) {
        return claimRepository.findByClaimantId(claimantId);
    }

    // READ: view claims submitted for an item
    public List<Claim> getClaimsByItem(Long itemId) {
        return claimRepository.findByItemId(itemId);
    }

    // UPDATE: edit the proof description
    public Claim updateClaim(Long id, Claim updatedClaim) {
        Claim existingClaim = getClaimById(id);

        if (existingClaim.getStatus() != ClaimStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only pending claims can be edited"
            );
        }

        if (updatedClaim.getProofDescription() == null
                || updatedClaim.getProofDescription().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Proof description is required"
            );
        }

        existingClaim.setProofDescription(
                updatedClaim.getProofDescription().trim()
        );

        return claimRepository.save(existingClaim);
    }

    // UPDATE: admin approves or rejects a claim
    public Claim updateClaimStatus(Long id, ClaimStatus newStatus) {
        Claim claim = getClaimById(id);

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only pending claims can be reviewed"
            );
        }

        if (newStatus != ClaimStatus.APPROVED
                && newStatus != ClaimStatus.REJECTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status must be APPROVED or REJECTED"
            );
        }

        claim.setStatus(newStatus);

        return claimRepository.save(claim);
    }

    // USER cancels a pending claim
    public Claim withdrawClaim(Long id) {
        Claim claim = getClaimById(id);

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only pending claims can be withdrawn"
            );
        }

        claim.setStatus(ClaimStatus.WITHDRAWN);

        return claimRepository.save(claim);
    }

    // DELETE: permanently remove a claim
    public void deleteClaim(Long id) {
        Claim claim = getClaimById(id);
        claimRepository.delete(claim);
    }

    private void validateClaimInput(Claim claim) {
        if (claim == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Claim data is required"
            );
        }

        if (claim.getItemId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Item ID is required"
            );
        }

        if (claim.getClaimantId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Claimant ID is required"
            );
        }

        if (claim.getProofDescription() == null
                || claim.getProofDescription().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Proof description is required"
            );
        }

        claim.setProofDescription(
                claim.getProofDescription().trim()
        );
    }
}