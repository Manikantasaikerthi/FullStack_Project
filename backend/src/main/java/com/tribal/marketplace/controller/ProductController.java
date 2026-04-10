package com.tribal.marketplace.controller;

import com.tribal.marketplace.entity.Product;
import com.tribal.marketplace.security.JwtUtil;
import com.tribal.marketplace.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private JwtUtil jwtUtil;

    // Public endpoint for anyone browsing the site
    @GetMapping("/public/approved")
    public ResponseEntity<List<Product>> getApprovedProducts() {
        return ResponseEntity.ok(productService.getAllApprovedProducts());
    }

    // Artisan endpoints
    @GetMapping("/artisan/{email}")
    @PreAuthorize("hasAnyRole('ARTISAN', 'ADMIN')")
    public ResponseEntity<List<Product>> getProductsByArtisan(@PathVariable String email) {
        return ResponseEntity.ok(productService.getProductsByArtisan(email));
    }

    @PostMapping
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<?> addProduct(@RequestBody Product product, @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            product.setArtisanEmail(email);
            Product saved = productService.addProduct(product);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR adding product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal error: " + e.getMessage());
        }
    }

    // Consultant endpoints
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN')")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts()); // Consultant filters pending in frontend
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<?> approveProduct(@PathVariable Long id) {
        return productService.approveProduct(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN', 'ARTISAN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productService.deleteProduct(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
