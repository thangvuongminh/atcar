package loveduong.duongcute.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import loveduong.duongcute.dto.request.BookingRequest;
import loveduong.duongcute.dto.request.OrderRequest;
import loveduong.duongcute.dto.request.UserRequest;
import loveduong.duongcute.dto.request.UserUpdateRequest;
import loveduong.duongcute.dto.response.*;
import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.repository.BookingRepository;
import loveduong.duongcute.service.ChatClientService;
import loveduong.duongcute.service.MomoService;
import loveduong.duongcute.service.UserService;
import loveduong.duongcute.util.constants.BookingStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import javax.validation.Valid;
import java.util.List;
import java.util.Set;

@Tag(name = "User",description = "User management APIs")
@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class UserController {
    ChatClientService chatClientService;
    UserService userService;
    MomoService momoService;
    private final BookingRepository bookingRepository;

    @PostMapping("register")
    public ResponseEntity<ApiResponse<Void>> handleRegister( @RequestBody UserRequest userRequest) {
        userService.createUser(userRequest);
        return  ResponseEntity.ok(ApiResponse.<Void>builder()
                .statusCode(200)
                .message("Get profile success")
                .build());
    }
    @GetMapping("users/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        String email = securityContext.getAuthentication().getName();
       UserResponse userResponse= userService.getUser(email);
       return  ResponseEntity.ok(ApiResponse.<UserResponse>builder()
               .statusCode(200)
               .message("Get profile success")
               .data(userResponse)
               .build());
    }
    @PostMapping("user/add/cart/{id}")
    public ResponseEntity<ApiResponse<?>> addProduct(@PathVariable   Long id) {
        userService.addProduct(id);
        return  ResponseEntity.ok(ApiResponse.<MomoResponse>builder()
                .statusCode(200)
                .message("Thêm vào giỏ hàng thành công")
                .build());
    }
    @GetMapping("user/get/cart")
    public ResponseEntity<ApiResponse<?>> getAllCard() {
         List<ProductResponse> productResponses=   userService.getAllCard();
        return  ResponseEntity.ok(ApiResponse.<List<ProductResponse>>builder()
                .statusCode(200)
                .message("Lấy giỏ hàng thành công")
                        .data(productResponses)
                .build());
    }
    @GetMapping("user/check/coupon")
    public ResponseEntity<ApiResponse<?>> isValidCoupon(@RequestParam String coupon) {
        Integer isValid=userService.isValidCoupon(coupon);
        return  ResponseEntity.ok(ApiResponse.<Integer>builder()
                .statusCode(200)
                .message("Kiểm tra coupon thành công")
                        .data(isValid)
                .build());
    }
    @PostMapping("user/create/order")
    public ResponseEntity<ApiResponse<?>> createOrder(@RequestBody OrderRequest orderRequest) {
         OrderResponse orderResponse=  userService.createOrder(orderRequest);
        return  ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .statusCode(200)
                .message("Kiểm tra coupon thành công")
                        .data(orderResponse)
                .build());
    }
    @DeleteMapping("user/delete/cart/{id}")
    public ResponseEntity<ApiResponse<?>> deleteCard(@PathVariable Long id) {
       userService.deleteCard(id);
        return  ResponseEntity.ok(ApiResponse.<List<ProductResponse>>builder()
                .statusCode(200)
                .message("Xóa  thành công")
                .build());
    }
    @PostMapping("user/booking")
    public ResponseEntity<ApiResponse<?>> handleBookingCalendar(@RequestBody BookingRequest req) {
        boolean isDuplicate = bookingRepository.existsByPhoneAndTimeBookingAndStatusNot(
                req.getPhone(),
                req.getTimeBooking(),
                BookingStatus.CANCELLED
        );

        if (isDuplicate) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .statusCode(400)
                    .message("Bạn đã có lịch hẹn trong ngày này rồi, vui lòng chọn ngày khác!")
                    .data(null)
                    .build());
        }
        userService.handleBookingCalendar(req);

        return ResponseEntity.ok(ApiResponse.<MomoResponse>builder()
                .statusCode(200)
                .message("Booking thành công")
                .build());
    }
    @PostMapping("user/payment")
    public ResponseEntity<ApiResponse<MomoResponse>> paymentOrder(@RequestBody  OrderRequest orderRequest) {
        MomoResponse momoResponse=    userService.paymentOrder(orderRequest);
        return  ResponseEntity.ok(ApiResponse.<MomoResponse>builder()
                .statusCode(200)
                .message("Chat success")
                .data(momoResponse)
                .build());
    }
    @GetMapping("user/get/all-order")
    public ResponseEntity<ApiResponse<Set<OrderResponse>>> getAllOrder() {
        Set<OrderResponse>  orderResponses  = userService.getAllOrder();
        return  ResponseEntity.ok(ApiResponse.<Set<OrderResponse>>builder()
                .statusCode(200)
                .message("Chat success")
                .data(orderResponses)
                .build());
    }
    @PostMapping("user/booking/status")
    public ResponseEntity<ApiResponse<MomoResponeStatus>> handleBookingCalendarStatus(@RequestParam("order") String orderId) {
        MomoResponeStatus momoResponeStatus=momoService.confirmPayment(orderId);
        return  ResponseEntity.ok(ApiResponse.<MomoResponeStatus>builder()
                .statusCode(200)
                .message("Chat success")
                .data(momoResponeStatus)
                .build());
    }
    @GetMapping("user/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        UserResponse userResponse=    userService.getProfile();
        return  ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("Chat success")
                .data(userResponse)
                .build());
    }
    @PutMapping("user/update/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        UserResponse userResponse=    userService.updateUser(userUpdateRequest);
        return  ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("Chat success")
                .data(userResponse)
                .build());
    }
    @Scheduled(fixedDelay =1000)
    public void scheduleFixedDelayTask() {

    }
}
