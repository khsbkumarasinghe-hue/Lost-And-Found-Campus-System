package com.uoc.lostandfound.controller;

import com.uoc.lostandfound.model.CampusLocation;
import com.uoc.lostandfound.service.CampusLocationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/campus-locations")
@CrossOrigin(origins = "*")
public class CampusLocationController {


    private final CampusLocationService service;


    public CampusLocationController(CampusLocationService service) {
        this.service = service;
    }


    // CREATE - Add new location
    @PostMapping
    public CampusLocation createLocation(
            @RequestBody CampusLocation location) {

        return service.saveLocation(location);
    }



    // READ - Get all locations
    @GetMapping
    public List<CampusLocation> getAllLocations() {

        return service.getAllLocations();
    }



    // READ - Get location by ID
    @GetMapping("/{id}")
    public ResponseEntity<CampusLocation> getLocationById(
            @PathVariable Long id) {


        return service.getLocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    // UPDATE - Update location
    @PutMapping("/{id}")
    public CampusLocation updateLocation(
            @PathVariable Long id,
            @RequestBody CampusLocation location) {


        return service.updateLocation(id, location);
    }



    // DELETE - Delete location
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLocation(
            @PathVariable Long id) {


        service.deleteLocation(id);

        return ResponseEntity.ok(
                "Campus location deleted successfully"
        );
    }

}