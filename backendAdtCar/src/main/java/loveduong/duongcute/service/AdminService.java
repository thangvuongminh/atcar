package loveduong.duongcute.service;

import loveduong.duongcute.dto.request.CreateDiscountRequest;
import loveduong.duongcute.dto.request.UserRequest;
import loveduong.duongcute.dto.response.BookingResponse;
import loveduong.duongcute.dto.response.CouponResponse;
import loveduong.duongcute.dto.response.PostResponse;
import loveduong.duongcute.dto.response.UserResponse;
import loveduong.duongcute.entity.Post;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.util.constants.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface AdminService {
    List<UserResponse> getAllUsers();
    void createDiscount(CreateDiscountRequest createDiscountRequest);
    public void handleSendDiscount(String code);
    public List<CouponResponse> getAllDiscount();
    UserResponse createEditor(UserRequest userRequest);
    void deleteEditor(String email);
    Page<PostResponse> handlePost(Specification<Post> spec, Pageable page);
    List<UserResponse> getAllEditor();
    Page<UserResponse>  filterEditor(Specification<User> spec, Pageable page);
    void deleteDiscount(String code);

}
