package loveduong.duongcute.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.entity.InvoiceProduct;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.util.constants.OrderStatus;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String id;
    String codeDiscount;
    double totalPrice;
    String tax;
    int percent;
    OrderStatus orderStatus;
    Instant orderExpireTime;
    Set<InvoicesProductResponse> invoicesProductResponses;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    LocalDateTime create_At;
    String note;
}
