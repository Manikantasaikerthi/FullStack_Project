package com.tribal.marketplace.controller;

import com.tribal.marketplace.entity.Order;
import com.tribal.marketplace.security.JwtUtil;
import com.tribal.marketplace.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Order> createOrder(@RequestBody Order order, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7));
        order.setCustomerEmail(email);
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Order>> getCustomerOrders(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7));
        return ResponseEntity.ok(orderService.getCustomerOrders(email));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ARTISAN', 'CONSULTANT', 'ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return orderService.updateOrderStatus(id, newStatus)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{orderId}/items/{itemId}/status")
    @PreAuthorize("hasAnyRole('ARTISAN', 'CONSULTANT', 'ADMIN')")
    public ResponseEntity<Order> updateItemStatus(
            @PathVariable Long orderId, 
            @PathVariable Long itemId, 
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String token) {
        
        String newStatus = body.get("status");
        String artisanEmail = body.get("artisanEmail");
        
        // If the user requesting isn't the artisan in the body, it must be consultant/admin acting on their behalf
        String requestingUser = jwtUtil.extractUsername(token.substring(7));
        if (artisanEmail == null) {
            artisanEmail = requestingUser;
        }

        return orderService.updateItemStatus(orderId, itemId, artisanEmail, newStatus)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
