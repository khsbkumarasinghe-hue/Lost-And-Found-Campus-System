package com.uoc.lostandfound.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;


    // Empty constructor (required by JPA)
    public Category() {
    }


    // Constructor
    public Category(String name) {
        this.name = name;
    }


    // Get ID
    public Long getId() {
        return id;
    }


    // Set ID
    public void setId(Long id) {
        this.id = id;
    }


    // Get Name
    public String getName() {
        return name;
    }


    // Set Name
    public void setName(String name) {
        this.name = name;
    }
}