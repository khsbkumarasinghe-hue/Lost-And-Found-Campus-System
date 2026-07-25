package com.uoc.lostandfound.service;

import com.uoc.lostandfound.model.CampusLocation;
import com.uoc.lostandfound.repository.CampusLocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampusLocationService {

    private final CampusLocationRepository campusLocationRepository;

    public CampusLocationService(CampusLocationRepository campusLocationRepository) {
        this.campusLocationRepository = campusLocationRepository;
    }

    // Get all locations
    public List<CampusLocation> getAllLocations() {
        return campusLocationRepository.findAll();
    }

    // Save location
    public CampusLocation saveLocation(CampusLocation campusLocation) {
        return campusLocationRepository.save(campusLocation);
    }

    // Get location by ID
    public CampusLocation getLocationById(Long id) {
        return campusLocationRepository.findById(id)
                .orElse(null);
    }

    // Update location
    public CampusLocation updateLocation(Long id, CampusLocation campusLocation) {

        CampusLocation existingLocation = campusLocationRepository.findById(id)
                .orElse(null);

        if (existingLocation != null) {
            existingLocation.setLocationName(campusLocation.getLocationName());
            existingLocation.setBuilding(campusLocation.getBuilding());
            existingLocation.setDescription(campusLocation.getDescription());

            return campusLocationRepository.save(existingLocation);
        }

        return null;
    }

    // Delete location
    public void deleteLocation(Long id) {
        campusLocationRepository.deleteById(id);
    }
}