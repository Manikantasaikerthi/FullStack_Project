package com.tribal.marketplace.controller;

import com.tribal.marketplace.entity.User;
import com.tribal.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedData) {
        return userRepository.findById(id).map(user -> {
            if (updatedData.getName() != null) user.setName(updatedData.getName());
            if (updatedData.getPhone() != null) user.setPhone(updatedData.getPhone());
            if (updatedData.getAddress() != null) user.setAddress(updatedData.getAddress());
            // Since it's primitive boolean we can just set it, or use Boolean object if we want null checks.
            // Simplified for the Artisan Approval feature:
            user.setApproved(updatedData.isApproved());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }
}
