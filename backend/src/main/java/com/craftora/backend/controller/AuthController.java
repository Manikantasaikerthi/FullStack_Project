package com.craftora.backend.controller;

import com.craftora.backend.model.*;
import com.craftora.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private ArtisanRepository artisanRepo;

    @Autowired
    private StaffRepository staffRepo;

    // ========================
    // CUSTOMER SIGNUP
    // ========================
    @PostMapping("/signup/customer")
    public String signupCustomer(@RequestBody Customer customer) {
        customerRepo.save(customer);
        return "Customer registered successfully";
    }

    // ========================
    // ARTISAN SIGNUP (PENDING)
    // ========================
    @PostMapping("/signup/artisan")
    public String signupArtisan(@RequestBody Artisan artisan) {
        artisan.setStatus("PENDING");
        artisanRepo.save(artisan);
        return "Artisan request submitted";
    }

    // ========================
    // LOGIN
    // ========================
    @PostMapping("/login")
    public Object login(@RequestBody LoginRequest request){

        // CUSTOMER
        Optional<Customer> customer =
                customerRepo.findByUsernameAndPasswordAndPhone(
                        request.getUsername(),
                        request.getPassword(),
                        request.getPhone()
                );

        if(customer.isPresent())
            return customer.get();


        // ARTISAN (only APPROVED)
        Optional<Artisan> artisan =
                artisanRepo.findByUsernameAndPasswordAndPhone(
                        request.getUsername(),
                        request.getPassword(),
                        request.getPhone()
                );

        if(artisan.isPresent() &&
                "APPROVED".equals(artisan.get().getStatus()))
            return artisan.get();


        // STAFF (ADMIN / CONSULTANT)
        Optional<Staff> staff =
                staffRepo.findByUsernameAndPasswordAndPhone(
                        request.getUsername(),
                        request.getPassword(),
                        request.getPhone()
                );

        if(staff.isPresent())
            return staff.get();


        return "Invalid credentials";
    }

    // ========================
    // CONSULTANT APIs
    // ========================

    // GET PENDING ARTISANS
    @GetMapping("/consultant/pending-artisans")
    public List<Artisan> getPendingArtisans() {
        return artisanRepo.findByStatus("PENDING");
    }

    // APPROVE ARTISAN
    @PostMapping("/consultant/approve/{id}")
    public String approveArtisan(@PathVariable Long id) {

        Artisan artisan = artisanRepo.findById(id).orElse(null);

        if (artisan == null)
            return "Artisan not found";

        artisan.setStatus("APPROVED");
        artisanRepo.save(artisan);

        return "Artisan approved";
    }

    // REJECT ARTISAN
    @PostMapping("/consultant/reject/{id}")
    public String rejectArtisan(@PathVariable Long id) {

        Artisan artisan = artisanRepo.findById(id).orElse(null);

        if (artisan == null)
            return "Artisan not found";

        artisan.setStatus("REJECTED");
        artisanRepo.save(artisan);

        return "Artisan rejected";
    }
}