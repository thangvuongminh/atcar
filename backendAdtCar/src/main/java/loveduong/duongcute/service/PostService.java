package loveduong.duongcute.service;

import loveduong.duongcute.dto.request.PostRequest;
import loveduong.duongcute.dto.response.PostResponse;
import loveduong.duongcute.entity.Post;
import loveduong.duongcute.util.constants.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostService {
    public List<String> getAllProducts(String name);
    public PostResponse changStatusPost(String id, PostStatus status);
    public Page<PostResponse> getPosts(Specification<Post> specification, Pageable pageable);
    public void deletePost(String id);
}
