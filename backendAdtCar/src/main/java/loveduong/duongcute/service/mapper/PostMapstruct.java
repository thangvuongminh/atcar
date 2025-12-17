package loveduong.duongcute.service.mapper;

import loveduong.duongcute.dto.request.PostRequest;
import loveduong.duongcute.dto.response.PostResponse;
import loveduong.duongcute.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface PostMapstruct {
    Post toPost(PostRequest postRequest);
    @Mapping(target = "categoryName",source = "category.name")
    PostResponse toPostResponse(Post post);
    Set<PostResponse> toPostResponseSet(Set<Post> posts);
}
