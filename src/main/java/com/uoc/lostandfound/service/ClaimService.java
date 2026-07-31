package com.uoc.lostandfound.service;

import com.uoc.lostandfound.model.Claim;
import com.uoc.lostandfound.model.ClaimStatus;
import com.uoc.lostandfound.model.Notification;
import com.uoc.lostandfound.repository.ClaimRepository;
import com.uoc.lostandfound.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.uoc.lostandfound.model.Item;
import com.uoc.lostandfound.model.User;
import com.uoc.lostandfound.repository.ItemRepository;
import com.uoc.lostandfound.repository.UserRepository;

import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;


    public ClaimService(ClaimRepository claimRepository, ItemRepository itemRepository, UserRepository userRepository, NotificationService notificationService) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // CREATE: submit a new claim
    public Claim createClaim(Long itemId, Long claimantId, String proofDescription) {

        // Step 1: make sure nothing important is missing
        if (itemId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item ID is required");
        }
        if (claimantId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Claimant ID is required");
        }
        if (proofDescription == null || proofDescription.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Proof description is required");
        }

        // Step 2: look up the actual Item and User from the database using the given IDs
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item not found");
        }

        User claimant = userRepository.findById(claimantId).orElse(null);
        if (claimant == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
        }

        // Step 3: stop the same user from claiming the same item twice
        boolean alreadyClaimed = claimRepository.existsByItemIdAndClaimantId(itemId, claimantId);
        if (alreadyClaimed) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This user has already submitted a claim for this item");
        }

        // Step 4: build the new claim and save it
        Claim claim = new Claim();
        claim.setItem(item);
        claim.setClaimant(claimant);
        claim.setProofDescription(proofDescription.trim());
        claim.setStatus(ClaimStatus.PENDING);

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
        Claim saved = claimRepository.save(claim);

        Notification notification = new Notification(
                "Your claim #" + saved.getId() + " was " + newStatus.name().toLowerCase() + "."
        );
        notification.setUserId(saved.getClaimant().getId());
        notificationService.createNotification(notification);

        return saved;
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

}