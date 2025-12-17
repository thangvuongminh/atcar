package loveduong.duongcute.controller;

import com.turkraft.springfilter.boot.Filter;
import com.turkraft.springfilter.boot.Page;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.request.PostRequest;
import loveduong.duongcute.dto.response.PostResponse;
import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.entity.Post;
import loveduong.duongcute.service.ChatClientService;
import loveduong.duongcute.service.EditorService;
import loveduong.duongcute.service.FilesStorageService;
import loveduong.duongcute.service.PostService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Tag(name = "Editor",description = "Editor management APIs")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class EditorController {
    FilesStorageService filesStorageService;
    EditorService editorService;
    PostService postService;
    ChatClientService chatClientService;
    @PostMapping("upload/media")
    public ResponseEntity<ApiResponse<?>> handleUpload(@RequestParam("files") MultipartFile[] files,String local){
        filesStorageService.save(files,local,false);
        return  ResponseEntity.ok().body(ApiResponse.builder().statusCode(200).message("Upload thanh cong").build());
    }
    @GetMapping("upload/media/get/all")
    public ResponseEntity<ApiResponse<?>> handleUpload(@RequestParam("local") String local){
          List<String>allFileName=  postService.getAllProducts(local);
        return  ResponseEntity.ok().body(ApiResponse.builder().statusCode(200)
                        .data(allFileName)
                .message("Load document success").build());
    }
    @DeleteMapping("upload/delete/media")
    public ResponseEntity<ApiResponse<?>> handleDeletedDocument(@RequestParam("name") String name,@RequestParam("local") String local){
        filesStorageService.deleteMedia(name,local);
        return  ResponseEntity.ok().body(ApiResponse.builder().statusCode(200).message("Delete document success").build());
    }
    @PostMapping("upload/post")
    public ResponseEntity<ApiResponse<PostResponse>> handleUploadPost( @ModelAttribute PostRequest postRequest){
        PostResponse postResponse= editorService.handleUploadPost(postRequest);
        return  ResponseEntity.ok().body(ApiResponse.<PostResponse>builder().message("Add post sucess").statusCode(200)
                        .data(postResponse)
                .build());
    }

    @GetMapping("get/post")
    public ResponseEntity<ApiResponse<Set<PostResponse>>> getPostByUser(){
        Set<PostResponse> postResponses= editorService.getPostByUser();
        return  ResponseEntity.ok().body(ApiResponse.<Set<PostResponse>>builder().message("Add post sucess").statusCode(200)
                .data(postResponses)
                .build());
    }
    @GetMapping("post/paginate")
    public ResponseEntity<ApiResponse<?>> postPaginate(@Filter Specification<Post> specification, @Page Pageable pageable){
        org.springframework.data.domain.Page<PostResponse> postResponses=postService.getPosts(specification,pageable);
        return  ResponseEntity.ok().body(ApiResponse.<org.springframework.data.domain.Page<PostResponse>>builder().message("Add post sucess").statusCode(200)
                .data(postResponses)
                .build());
    }
    @PutMapping("upload/post/update/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> handleUpdatePost(@ModelAttribute PostRequest postRequest,@PathVariable Long id){
        PostResponse postResponse= editorService.handleUpdatePost(postRequest,id);
        return  ResponseEntity.ok().body(ApiResponse.<PostResponse>builder().message("Update post sucess").statusCode(200)
                .data(postResponse)
                .build());
    }
    // can edit
    @DeleteMapping("upload/delete/post/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> handleDelePost(@PathVariable Long id){
         editorService.handleDelePost(id);
        return  ResponseEntity.ok().body(ApiResponse.<PostResponse>builder().message("Delete post sucess").statusCode(204)
                .build());
    }

}
