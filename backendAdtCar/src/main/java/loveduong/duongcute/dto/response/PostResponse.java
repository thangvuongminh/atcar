package loveduong.duongcute.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.entity.Category;
import loveduong.duongcute.service.ProductService;
import loveduong.duongcute.util.constants.PostStatus;
import loveduong.duongcute.util.constants.ProductStatus;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostResponse {
    String id;
    String title;
    String description;
    String create_by;
    String update_by;
    UserResponse userResponse;
    PostStatus postStatus;
    List<String> urlImg;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm",timezone = "Asia/Ho_Chi_Minh")
    Instant create_At;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm",timezone = "Asia/Ho_Chi_Minh")
    Instant update_AT;
    String categoryName;
}
