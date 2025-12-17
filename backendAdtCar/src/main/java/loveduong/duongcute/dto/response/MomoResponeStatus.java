package loveduong.duongcute.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MomoResponeStatus {
    private String partnerCode;
    private String requestId;
    private String orderId;
    private String extraData;
    private Long amount;
    private Long transId;
    private String payType;
    private Integer resultCode;
    private List<Object> refundTrans;
    private String message;
    private Long responseTime;
}
