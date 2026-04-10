package com.tribal.marketplace.security;

import com.tribal.marketplace.entity.User;
import com.tribal.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Also support hardcoded admin and consultant for easy testing
        if ("manikantasaikearthi@gmail.com".equals(email)) {
            return new org.springframework.security.core.userdetails.User(
                    "manikantasaikearthi@gmail.com",
                    "{noop}Mani@81412241929", // No encoding for hardcoded testing
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }
        if ("saisivacharan321@gmail.com".equals(email)) {
             return new org.springframework.security.core.userdetails.User(
                    "saisivacharan321@gmail.com",
                    "{noop}Sai@2006",
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_CONSULTANT")));
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase())));
    }
}
