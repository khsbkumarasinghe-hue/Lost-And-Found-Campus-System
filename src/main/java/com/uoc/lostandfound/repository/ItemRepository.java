package com.uoc.lostandfound.repository;

import com.uoc.lostandfound.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}