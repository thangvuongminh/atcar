package loveduong.duongcute.controller;

import com.turkraft.springfilter.boot.Filter;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.response.PostResponse;
import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.entity.Post;
import loveduong.duongcute.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("post")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true,level = AccessLevel.PRIVATE)
public class PostController {
    PostService postService;
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPostsIsPublic(@Filter Specification<Post> specification, Pageable pageable) {
        Page<PostResponse> postResponses=  postService.getPosts(specification,pageable);
        return  ResponseEntity.ok().body(ApiResponse.<Page<PostResponse>>builder()
                        .message("Get posts successfully!")
                        .data(postResponses)
                .build());
    }
}
