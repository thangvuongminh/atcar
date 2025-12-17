package loveduong.duongcute.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import loveduong.duongcute.util.constants.OrderStatus;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_order_product",indexes = {@Index(name = "idx_orders_status_expires",columnList = "orderStatus,orderExpireTime")})

public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
     String id;
     String codeDiscount;
     double totalPrice;
     String tax ;
     int percent;
     @Enumerated(EnumType.STRING)
     OrderStatus orderStatus;
     Instant orderExpireTime;
    @OneToMany(
            mappedBy = "order",
            fetch = FetchType.LAZY
    )
     Set<InvoiceProduct> invoiceProducts;
    @ManyToOne
    @JoinColumn(name = "user_id")
     User user;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    LocalDateTime create_At;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
     Instant update_AT;
     String note;

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        this.create_At = LocalDateTime.now();
        this.update_AT = now;
        if (this.tax == null) {
            this.tax = UUID.randomUUID().toString();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.update_AT = Instant.now();
    }
}
