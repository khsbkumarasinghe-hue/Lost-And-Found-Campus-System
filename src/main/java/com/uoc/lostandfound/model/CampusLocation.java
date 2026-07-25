package com.uoc.lostandfound.model;

import jakarta.persistence.*;

@Entity
@Table(name = "campus_locations")
public class CampusLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String locationName;

    @Column(nullable = false)
    private String building;

    private String description;

    // Empty constructor
    public CampusLocation() {
    }

    // Constructor
    public CampusLocation(String locationName, String building, String description) {
        this.locationName = locationName;
        this.building = building;
        this.description = description;
    }

    // Get ID
    public Long getId() {
        return id;
    }

    // Set ID
    public void setId(Long id) {
        this.id = id;
    }

    // Get Location Name
    public String getLocationName() {
        return locationName;
    }

    // Set Location Name
    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    // Get Building
    public String getBuilding() {
        return building;
    }

    // Set Building
    public void setBuilding(String building) {
        this.building = building;
    }

    // Get Description
    public String getDescription() {
        return description;
    }

    // Set Description
    public void setDescription(String description) {
        this.description = description;
    }
}
