package loveduong.duongcute.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.entity.Role;
import loveduong.duongcute.util.constants.Roles;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
  @NotBlank(message = "Tên  bắt buộc phải nhập")
      String name;
  @NotBlank(message = "Số điện thoại không được để trống")
  @Pattern(regexp = "^(0[3|5|7|8|9])[0-9]{8}$", message = "Số điện thoại không hợp lệ")
  String phone;
  String address;
  @NotBlank(message = "Mật khẩu không được để trống")
  @Size(min = 6,max = 12)
  String password;
  @NotBlank(message = "Email không được bỏ trống")
  @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Email không hợp lệ")
  @Schema(example = "test@gmail.com")
  String email;
}
