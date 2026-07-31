package com.uoc.lostandfound.repository;

import com.uoc.lostandfound.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByClaimantId(Long claimantId);
    List<Claim> findByItemId(Long itemId);
    boolean existsByItemIdAndClaimantId(Long itemId, Long claimantId);
}