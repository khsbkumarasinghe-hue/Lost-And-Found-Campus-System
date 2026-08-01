package com.uoc.lostandfound.repository;

import com.uoc.lostandfound.model.CampusLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampusLocationRepository
        extends JpaRepository<CampusLocation, Long> {

}