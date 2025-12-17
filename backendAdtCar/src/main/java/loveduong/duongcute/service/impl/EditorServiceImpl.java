package loveduong.duongcute.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import loveduong.duongcute.dto.request.PostRequest;
import loveduong.duongcute.dto.response.PostResponse;
import loveduong.duongcute.entity.Category;
import loveduong.duongcute.entity.Post;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.repository.CategoryRepository;
import loveduong.duongcute.repository.PostRepository;
import loveduong.duongcute.repository.UserRepository;
import loveduong.duongcute.service.EditorService;
import loveduong.duongcute.service.FilesStorageService;
import loveduong.duongcute.service.exception.AppException;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import loveduong.duongcute.service.mapper.PostMapstruct;
import loveduong.duongcute.service.mapper.UserMapstruct;
import loveduong.duongcute.util.constants.PostStatus;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class EditorServiceImpl implements EditorService {
    PostRepository postRepository;
    PostMapstruct postMapstruct;
    CategoryRepository categoryRepository;
    FilesStorageService filesStorageService;
    RedisTemplate template;
    UserMapstruct userMapstruct;
    UserRepository userRepository;

    @Override
    public PostResponse handleUploadPost(PostRequest postRequest) {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        List<String> listUrl= new ArrayList<>();
        User user = userRepository.findByEmail(authentication.getName());
        if(postRequest.getFiles()!=null){
            listUrl = filesStorageService.save(postRequest.getFiles(),postRequest.getCategoryName(),true);
        }
        if(postRequest.getUrl()!=null){
            for(String tmp: postRequest.getUrl()){
                listUrl.add(tmp);
            }
        }
        Category category = categoryRepository.findByName(postRequest.getCategoryName());
        if (category==null){
            category=Category.builder().name(postRequest.getCategoryName()).build();
            categoryRepository.save(category);
        }
        Post post=postMapstruct.toPost(postRequest);
        post.setUser(user);
        post.setPostStatus(PostStatus.PENDING_REVIEW);
        post.setCategory(category);
        post.setUrlImg(listUrl);
        postRepository.save(post);
        PostResponse postResponse =postMapstruct.toPostResponse(post);
        postResponse.setUserResponse(userMapstruct.toUserResponse(user));
        return postResponse;
    }

    @Override
    public PostResponse handleUpdatePost(PostRequest postRequest, Long id) {
        SecurityContext securityContext= SecurityContextHolder.getContext();
        Authentication authentication=securityContext.getAuthentication();
        boolean isSuccess = template.opsForValue().setIfAbsent("post_"+id, authentication.getName(), 300, TimeUnit.SECONDS);
        if(!isSuccess){
            String curOwn=(String) template.opsForValue().get("post_"+id);
            if (curOwn.equals(authentication.getName())){
                template.expire("post_"+id,300,TimeUnit.SECONDS);
            }else {
                throw new AppException(ExceptionEnums.POST_IS_EDITED);
            }
        }
        Post post=postRepository.findById(id).orElseThrow(()->new AppException(ExceptionEnums.POST_NOT_EXIST));
        List<String> listUrl= new ArrayList<>();
        if(postRequest.getFiles()!=null){
            listUrl = filesStorageService.save(postRequest.getFiles(),postRequest.getCategoryName(),true);
        }
        filesStorageService.delete(post.getUrlImg(),false);
        if(postRequest.getUrl()!=null){
            String urlTmp="";
            for(String tmp: postRequest.getUrl()){
                urlTmp=tmp.substring(30);
                listUrl.add(urlTmp);
            }

        }
        Category category = categoryRepository.findByName(postRequest.getCategoryName());
        if (category==null){
            category=Category.builder().name(postRequest.getCategoryName()).build();
            categoryRepository.save(category);
        }

        if(!listUrl.isEmpty()){
            post.setUrlImg(listUrl);
        }
        post.setTitle(postRequest.getTitle());
        post.setCategory(category);
        post.setDescription(post.getDescription());
        postRepository.save(post);
        return postMapstruct.toPostResponse(post);
    }

    @Override
    public void handleDelePost(Long id) {
        SecurityContext securityContext=SecurityContextHolder.getContext();
        Authentication authentication=securityContext.getAuthentication();
        Post post=postRepository.findById(id).orElseThrow(()->new AppException(ExceptionEnums.POST_NOT_EXIST));
        User user=post.getUser();
        if(!user.getEmail().equals(authentication.getName())){
            throw new AppException(ExceptionEnums.POST_NOT_EXIST);
        }
        postRepository.delete(post);
    }

    @Override
    public Set<PostResponse> getPostByUser() {
        SecurityContext securityContext= SecurityContextHolder.getContext();
        Authentication authentication=securityContext.getAuthentication();
        User user = userRepository.findByEmail(authentication.getName());
        Set<Post> posts=user.getPosts();
        Set<PostResponse> postResponses=postMapstruct.toPostResponseSet(posts);
        return postResponses;
    }
}
