package loveduong.duongcute.dto.request;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    @Id
            @GeneratedValue(strategy = GenerationType.UUID)
     String id;
    String note;
    Double totalPrice;
    String codeDiscount;
    List<ProductBuy> productBuys;
    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    public static  class ProductBuy{
        Long productId;
        Long quantity;
        Long price;
    }

}
