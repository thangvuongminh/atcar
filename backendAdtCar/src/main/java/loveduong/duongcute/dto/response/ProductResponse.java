package loveduong.duongcute.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.util.constants.ProductStatus;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse {
    String id;
    String name;
    String url;
    String description;
    Long quantity;
    Long sold;
    String unit;
    Long priceFake;
    Long price;

    String manufacture;
    ProductStatus productStatus;
    String brand;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    Instant createdAt;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    Instant updatedAt;
}
