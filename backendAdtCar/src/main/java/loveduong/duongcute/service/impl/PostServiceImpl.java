package loveduong.duongcute.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.response.MomoResponeStatus;
import loveduong.duongcute.dto.response.MomoResponse;
import loveduong.duongcute.dto.response.PostResponse;
import loveduong.duongcute.entity.Post;
import loveduong.duongcute.repository.PostRepository;
import loveduong.duongcute.service.FilesStorageService;
import loveduong.duongcute.service.MomoService;
import loveduong.duongcute.service.PostService;
import loveduong.duongcute.service.exception.AppException;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import loveduong.duongcute.service.mapper.PostMapstruct;
import loveduong.duongcute.util.constants.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(makeFinal = true,level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    PostRepository postRepository;
    FilesStorageService filesStorageService;
    PostMapstruct postMapstruct;
    @Override
    public  List<String> getAllProducts(String name) {
        List<String> nameFile=filesStorageService.loadAll(name);
        return nameFile;
    }

    @Override
    public PostResponse changStatusPost(String id, PostStatus status) {
        Long mainId;
        try {
            mainId=Long.parseLong(id);
            Post post=postRepository.findById(mainId).orElseThrow(()-> new AppException(ExceptionEnums.POST_NOT_EXIST));
            post.setPostStatus(status);
            postRepository.save(post);
            return postMapstruct.toPostResponse(post);
        }catch (NumberFormatException e){
            throw new AppException(ExceptionEnums.POST_NOT_EXIST);
        }
    }

    @Override
    public Page<PostResponse> getPosts(Specification<Post> specification, Pageable pageable) {
        Specification<Post> specification1= (root, query, builder) -> builder.equal(root.get("postStatus"),"PUBLISHED") ;
        Specification<Post> defaultSpecification =(specification==null)?specification1:specification1.and(specification);
        Page<Post> posts=postRepository.findAll(defaultSpecification,pageable);
        Page<PostResponse> postResponsePage=posts.map(postMapstruct::toPostResponse);
        return postResponsePage;
    }

    @Override
    public void deletePost(String id) {
        Long mainId;
        try {
            mainId=Long.parseLong(id);
            Post post=postRepository.findById(mainId).orElseThrow(()-> new AppException(ExceptionEnums.POST_NOT_EXIST));
            postRepository.delete(post);
        }catch (NumberFormatException e){
            throw new AppException(ExceptionEnums.POST_NOT_EXIST);
        }
    }

}
