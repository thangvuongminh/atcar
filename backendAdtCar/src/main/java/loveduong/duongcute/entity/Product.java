package loveduong.duongcute.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import loveduong.duongcute.util.constants.PostStatus;
import loveduong.duongcute.util.constants.ProductStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    @Column(columnDefinition = "MEDIUMTEXT")
    String url;
    @Column(columnDefinition = "MEDIUMTEXT")
    String description;
    Long priceFake;
    Long price;
    Long quantity;
    String unit;
    String manufacture;
    Long sold;
    @OneToMany(mappedBy = "product",fetch = FetchType.LAZY)
    Set<InvoiceProduct> invoiceProducts;
    @Enumerated(EnumType.STRING)
    ProductStatus productStatus;
    String brand;
    Instant createdAt;
    Instant updatedAt;
    @PrePersist
    public void makeCreated(){
        createdAt= Instant.now();
        updatedAt = Instant.now();
    }
    @PreUpdate
    public void makeUpdate(){
        updatedAt = Instant.now();
    }
}
