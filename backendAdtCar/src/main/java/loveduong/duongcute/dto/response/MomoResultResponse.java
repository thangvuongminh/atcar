package loveduong.duongcute.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MomoResultResponse {
    String partnerCode;
    String orderId;
    String requestId;
    Long amount;
    String partnerUserId;
    String storeId;
    String orderInfo;
    String orderType;
    Long transId;
    Integer resultCode;
    String message;
    String payType;
    Long responseTime;
    String extraData;
    String signature;
    String paymentOption;
    Long userFee;
}
