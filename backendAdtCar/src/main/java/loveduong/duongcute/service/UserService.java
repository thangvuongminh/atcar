package loveduong.duongcute.service;
import loveduong.duongcute.dto.request.BookingRequest;
import loveduong.duongcute.dto.request.OrderRequest;
import loveduong.duongcute.dto.request.UserRequest;
import loveduong.duongcute.dto.request.UserUpdateRequest;
import loveduong.duongcute.dto.response.MomoResponse;
import loveduong.duongcute.dto.response.OrderResponse;
import loveduong.duongcute.dto.response.ProductResponse;
import loveduong.duongcute.dto.response.UserResponse;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Set;

public interface  UserService  {
    UserResponse createUser(UserRequest userRequest);
    UserResponse getUser(String email);
    UserResponse getProfile();
    void addProduct(Long id);
     List<ProductResponse>  getAllCard();
    UserResponse updateUser(UserUpdateRequest userUpdateRequest);
    void deleteCard(Long id);
    void handleDeleteUsers(String id);
    Integer isValidCoupon(String coupon);
    OrderResponse createOrder(OrderRequest orderRequest);
    Set<OrderResponse> getAllOrder();
    MomoResponse paymentOrder(OrderRequest orderRequest);

    void handleBookingCalendar(BookingRequest bookingRequest);
}
