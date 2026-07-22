package com.uoc.lostandfound.service;

import com.uoc.lostandfound.model.User;
import com.uoc.lostandfound.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    // Save user
    public User saveUser(User user) {
        return userRepository.save(user);
    }


    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElse(null);
    }


    // Update user
    public User updateUser(Long id, User user) {

        User existingUser = userRepository.findById(id)
                .orElse(null);

        if (existingUser != null) {

            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());
            existingUser.setPhone(user.getPhone());

            return userRepository.save(existingUser);
        }

        return null;
    }


    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
