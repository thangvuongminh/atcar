package loveduong.duongcute.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDiscountRequest {
    @NotBlank(message = "Code không được để trống")
    String code;
    @Min(1)
    int discount;
    @NotBlank(message = "Mô tả không được để trống")
    String desc;
    LocalDateTime expire;
}
