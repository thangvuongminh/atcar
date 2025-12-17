package loveduong.duongcute.dto.request;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.entity.Category;
import loveduong.duongcute.util.constants.PostStatus;
import org.springframework.data.annotation.Id;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostRequest {
    @NotBlank(message = "Title không được để trống")
    String title;
    String description;
    MultipartFile[] files;
    String[] url;
    String  categoryName;
    PostStatus postStatus;
}
