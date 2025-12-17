package loveduong.duongcute.service;

import loveduong.duongcute.dto.request.PostRequest;
import loveduong.duongcute.dto.response.PostResponse;

import java.util.List;
import java.util.Set;

public interface EditorService {
    public PostResponse handleUploadPost(PostRequest postRequest);
    public PostResponse handleUpdatePost(PostRequest postRequest,Long id);
    public void handleDelePost(Long id);
    public Set<PostResponse> getPostByUser();
}
