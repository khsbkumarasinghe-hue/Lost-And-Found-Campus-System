package com.uoc.lostandfound.service;

import com.uoc.lostandfound.model.CampusLocation;
import com.uoc.lostandfound.repository.CampusLocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CampusLocationService {

    private final CampusLocationRepository repository;


    public CampusLocationService(CampusLocationRepository repository) {
        this.repository = repository;
    }


    // Create
    public CampusLocation saveLocation(CampusLocation location) {
        return repository.save(location);
    }


    // Read all
    public List<CampusLocation> getAllLocations() {
        return repository.findAll();
    }


    // Read by ID
    public Optional<CampusLocation> getLocationById(Long id) {
        return repository.findById(id);
    }


    // Update
    public CampusLocation updateLocation(Long id, CampusLocation newLocation) {

        CampusLocation existingLocation =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Location not found"));


        existingLocation.setLocationName(
                newLocation.getLocationName()
        );

        existingLocation.setBuildingName(
                newLocation.getBuildingName()
        );

        existingLocation.setDescription(
                newLocation.getDescription()
        );

        existingLocation.setLatitude(
                newLocation.getLatitude()
        );

        existingLocation.setLongitude(
                newLocation.getLongitude()
        );


        return repository.save(existingLocation);
    }


    // Delete
    public void deleteLocation(Long id) {
        repository.deleteById(id);
    }
}