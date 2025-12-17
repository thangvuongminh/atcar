package loveduong.duongcute.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MomoResponse {
    String partnerCode;
    String requestId;
    String orderId;
    Long amount;
    Long responseTime;
    String message;
    Integer resultCode;
    String payUrl;
}
