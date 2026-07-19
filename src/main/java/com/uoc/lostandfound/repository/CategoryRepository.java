package com.uoc.lostandfound.repository;

import com.uoc.lostandfound.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}