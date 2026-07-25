package com.uoc.lostandfound.controller;

import com.uoc.lostandfound.model.Claim;
import com.uoc.lostandfound.model.ClaimStatus;
import com.uoc.lostandfound.service.ClaimService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    // CREATE: submit a new claim
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Claim createClaim(@RequestBody Claim claim) {
        return claimService.createClaim(claim);
    }

    // READ: view all claims
    @GetMapping
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    // READ: view one claim by ID
    @GetMapping("/{id}")
    public Claim getClaimById(@PathVariable Long id) {
        return claimService.getClaimById(id);
    }

    // READ: view claims submitted by one user
    @GetMapping("/user/{claimantId}")
    public List<Claim> getClaimsByClaimant(
            @PathVariable Long claimantId
    ) {
        return claimService.getClaimsByClaimant(claimantId);
    }

    // READ: view claims for one item
    @GetMapping("/item/{itemId}")
    public List<Claim> getClaimsByItem(
            @PathVariable Long itemId
    ) {
        return claimService.getClaimsByItem(itemId);
    }

    // UPDATE: edit proof description
    @PutMapping("/{id}")
    public Claim updateClaim(
            @PathVariable Long id,
            @RequestBody Claim updatedClaim
    ) {
        return claimService.updateClaim(id, updatedClaim);
    }

    // UPDATE: admin approves or rejects a claim
    @PatchMapping("/{id}/status")
    public Claim updateClaimStatus(
            @PathVariable Long id,
            @RequestParam ClaimStatus status
    ) {
        return claimService.updateClaimStatus(id, status);
    }

    // UPDATE: user withdraws a pending claim
    @PatchMapping("/{id}/withdraw")
    public Claim withdrawClaim(@PathVariable Long id) {
        return claimService.withdrawClaim(id);
    }

    // DELETE: permanently delete a claim
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
    }
}