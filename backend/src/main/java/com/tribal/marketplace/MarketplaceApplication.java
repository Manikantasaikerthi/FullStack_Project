package com.tribal.marketplace;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class MarketplaceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MarketplaceApplication.class, args);
	}

	@Bean
	public CommandLineRunner schemaUpdater(JdbcTemplate jdbcTemplate) {
		return args -> {
			System.out.println("Applying database schema migration...");
			try {
				jdbcTemplate.execute("ALTER TABLE products MODIFY image_url LONGTEXT");
				System.out.println("SUCCESS: Database column 'image_url' migrated to LONGTEXT.");
			} catch (Exception e) {
				System.out.println("INFO: Schema update skipped (column may already be LONGTEXT).");
			}
		};
	}
}
