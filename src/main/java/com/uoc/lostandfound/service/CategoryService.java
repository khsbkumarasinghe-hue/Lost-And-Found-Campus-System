package com.uoc.lostandfound.service;

import com.uoc.lostandfound.model.Category;
import com.uoc.lostandfound.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }


    // Save category
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }


    // Get category by ID
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElse(null);
    }


    // Update category
    public Category updateCategory(Long id, Category category) {

        Category existingCategory = categoryRepository.findById(id)
                .orElse(null);

        if (existingCategory != null) {
            existingCategory.setName(category.getName());
            return categoryRepository.save(existingCategory);
        }

        return null;
    }


    // Delete category
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}