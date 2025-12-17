package loveduong.duongcute.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoicesProductResponse {
    ProductResponse productResponse;
    Long price;
    Long quantity;
}
