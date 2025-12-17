package loveduong.duongcute.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.util.constants.ProductStatus;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequest {
    Long id;
    @NotBlank(message = "Tên sản phẩm không được để trống")
    String name;
    @NotBlank(message = "Sản phẩm phải có hình ảnh")
    MultipartFile img;
    String description;
    @Size(min = 1,message = "Sản phẩm được bán ít nhất  phải còn")
    Long quantity;
    String unit;
    Long priceFake;
    Long sold;
    Long price;
    String manufacture;
    ProductStatus productStatus;
    String brand;
}
