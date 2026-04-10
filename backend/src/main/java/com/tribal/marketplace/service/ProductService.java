package com.tribal.marketplace.service;

import com.tribal.marketplace.entity.Product;
import com.tribal.marketplace.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllApprovedProducts() {
        return productRepository.findByApprovedTrue();
    }

    public List<Product> getProductsByArtisan(String email) {
        return productRepository.findByArtisanEmail(email);
    }

    public Product addProduct(Product product) {
        // New products are unapproved by default unless uploaded by admin
        product.setApproved(false);
        return productRepository.save(product);
    }

    public Optional<Product> approveProduct(Long id) {
        Optional<Product> prodOpt = productRepository.findById(id);
        if (prodOpt.isPresent()) {
            Product p = prodOpt.get();
            p.setApproved(true);
            return Optional.of(productRepository.save(p));
        }
        return Optional.empty();
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
