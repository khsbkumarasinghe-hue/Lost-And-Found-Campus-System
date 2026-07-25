package com.uoc.lostandfound.controller;

import com.uoc.lostandfound.model.CampusLocation;
import com.uoc.lostandfound.service.CampusLocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class CampusLocationController {

    private final CampusLocationService campusLocationService;

    public CampusLocationController(CampusLocationService campusLocationService) {
        this.campusLocationService = campusLocationService;
    }

    // Get all locations
    @GetMapping
    public List<CampusLocation> getAllLocations() {
        return campusLocationService.getAllLocations();
    }

    // Create location
    @PostMapping
    public CampusLocation createLocation(@RequestBody CampusLocation campusLocation) {
        return campusLocationService.saveLocation(campusLocation);
    }

    // Get location by ID
    @GetMapping("/{id}")
    public CampusLocation getLocationById(@PathVariable Long id) {
        return campusLocationService.getLocationById(id);
    }

    // Update location
    @PutMapping("/{id}")
    public CampusLocation updateLocation(
            @PathVariable Long id,
            @RequestBody CampusLocation campusLocation) {

        return campusLocationService.updateLocation(id, campusLocation);
    }

    // Delete location
    @DeleteMapping("/{id}")
    public String deleteLocation(@PathVariable Long id) {

        campusLocationService.deleteLocation(id);

        return "Campus Location deleted successfully";
    }
}
