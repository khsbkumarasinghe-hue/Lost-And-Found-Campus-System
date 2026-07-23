package com.uoc.lostandfound.service;

import com.uoc.lostandfound.model.Item;
import com.uoc.lostandfound.repository.ItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item updatedItem) {
        Item existing = itemRepository.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setName(updatedItem.getName());
        existing.setCategory(updatedItem.getCategory());
        existing.setDescription(updatedItem.getDescription());
        existing.setLocation(updatedItem.getLocation());
        existing.setStatus(updatedItem.getStatus());
        existing.setDate(updatedItem.getDate());
        return itemRepository.save(existing);
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }
}
