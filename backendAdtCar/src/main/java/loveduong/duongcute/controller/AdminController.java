package loveduong.duongcute.controller;

import com.turkraft.springfilter.boot.Filter;
import com.turkraft.springfilter.boot.Page;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.request.CreateDiscountRequest;
import loveduong.duongcute.dto.request.ProductRequest;
import loveduong.duongcute.dto.request.UserRequest;
import loveduong.duongcute.dto.response.*;
import loveduong.duongcute.entity.*;
import loveduong.duongcute.repository.BookingRepository;
import loveduong.duongcute.service.AdminService;
import loveduong.duongcute.service.PostService;
import loveduong.duongcute.service.ProductService;
import loveduong.duongcute.service.UserService;
import loveduong.duongcute.util.constants.BookingStatus;
import loveduong.duongcute.util.constants.PostStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Tag(name = "Admin",description = "Admin management APIs")
@RequestMapping("admin")
public class AdminController {
    UserService userService;
    AdminService adminService;
    ProductService productService;
    private final PostService postService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<?>> getAllUsers(){
        List<UserResponse> allUsers= adminService.getAllUsers();
        return  ResponseEntity.ok().body(ApiResponse.builder()
                        .statusCode(200)
                        .message("Lấy thông tin người dùng thành công")
                        .data(allUsers)
                .build());
    }
    BookingRepository bookingRepository;
    // ------------------------------------------------------------------
    // XỬ LÝ UPDATE TRẠNG THÁI BOOKING (Làm trực tiếp tại Controller)
    // ------------------------------------------------------------------
    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable String id,
            @RequestParam("status") BookingStatus status
    ) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Booking ID: " + id));

        booking.setStatus(status);
        Booking savedBooking = bookingRepository.save(booking);
        BookingResponse response = BookingResponse.builder()
                .id(savedBooking.getId())
                .name(savedBooking.getName())
                .phone(savedBooking.getPhone())
                .timeBooking(savedBooking.getTimeBooking())
                .startTime(savedBooking.getStartTime())
                .status(savedBooking.getStatus())
                .note(savedBooking.getNote())
                .retailId(savedBooking.getRetail() != null ? savedBooking.getRetail().getId() : null)
                .retailName(savedBooking.getRetail() != null ? savedBooking.getRetail().getName() : null)
                .build();

        return ResponseEntity.ok().body(ApiResponse.<BookingResponse>builder()
                .statusCode(200)
                .message("Cập nhật trạng thái thành công")
                .data(response)
                .build());
    }
    @GetMapping("/bookings/filter")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<BookingResponse>>> filterBookings(
            @Filter Specification<Booking> spec,
            @Page Pageable page
    ) {
        var bookingPage = bookingRepository.findAll(spec, page);

        var mapped = bookingPage.map(b -> BookingResponse.builder()
                .id(b.getId())
                .name(b.getName())
                .phone(b.getPhone())
                .timeBooking(b.getTimeBooking())
                .startTime(b.getStartTime())
                .status(b.getStatus())
                .note(b.getNote())
                .retailId(b.getRetail() != null ? b.getRetail().getId() : null)
                .retailName(b.getRetail() != null ? b.getRetail().getName() : null)
                .build()
        );

        return ResponseEntity.ok().body(
                ApiResponse.<org.springframework.data.domain.Page<BookingResponse>>builder()
                        .statusCode(200)
                        .message("Filter bookings success")
                        .data(mapped)
                        .build()
        );
    }
    @GetMapping("/users/delete/{id}")
    public ResponseEntity<ApiResponse<?>> handleDeleteUsers(@PathVariable String id){
        userService.handleDeleteUsers(id);
        return  ResponseEntity.ok().body(ApiResponse.builder()
                .statusCode(200)
                .message("Delete user success")
                .build());
    }
    @PostMapping("/users/discount")
    public ResponseEntity<ApiResponse<?>> createDiscount(@RequestBody CreateDiscountRequest createDiscountRequest){
         adminService.createDiscount(createDiscountRequest);
        return  ResponseEntity.ok().body(ApiResponse.builder()
                .statusCode(200)
                .message("Create discount success")
                .build());
    }
    @GetMapping("/users/send/discounts")
    public ResponseEntity<ApiResponse<?>> createDiscount(@RequestParam("code")String code){
        adminService.handleSendDiscount(code);
        return  ResponseEntity.ok().body(ApiResponse.builder()
                .statusCode(200)
                .message("Send discount success")
                .build());
    }
    @GetMapping("/users/get")
    public ResponseEntity<ApiResponse<?>> getAllDiscount(){
        List<CouponResponse> couponResponses=    adminService.getAllDiscount();
        return  ResponseEntity.ok().body(ApiResponse.<List<CouponResponse>>builder()
                .statusCode(200)
                .message("Get all discount success")
                        .data(couponResponses)
                .build());
    }
    @GetMapping("/users/delete/discount/{code}")
    public ResponseEntity<ApiResponse<?>> deleteDiscount(@PathVariable String code){
         adminService.deleteDiscount(code);
        return  ResponseEntity.ok().body(ApiResponse.<List<CouponResponse>>builder()
                .statusCode(200)
                .message("Delete discount success")
                .build());
    }
    @PostMapping("/create/editor")
    public ResponseEntity<ApiResponse<UserResponse>> createEditor(@Valid @RequestBody UserRequest userRequest){
        UserResponse userResponse= adminService.createEditor(userRequest);
        return  ResponseEntity.ok().body(ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("Add editor success")
                        .data(userResponse)
                .build());
    }
    @GetMapping("/editor/all")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllEditor(){
        List<UserResponse> userResponses= adminService.getAllEditor();
        return  ResponseEntity.ok().body(ApiResponse.<List<UserResponse>>builder()
                .statusCode(200)
                .message("Get all editor success")
                        .data(userResponses)
                .build());
    }
    @PatchMapping("/editor/delete/{email}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> deleteEditor (@PathVariable String email){
        adminService.deleteEditor(email);
        return  ResponseEntity.ok().body(ApiResponse.<List<UserResponse>>builder()
                .statusCode(200)
                .message("Detele user success")
                .build());
    }
    @GetMapping("/editor/filter")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<UserResponse>>> filterEditor (@Filter Specification<User> spec, @Page Pageable page){
        org.springframework.data.domain.Page<UserResponse> userResponsePage=   adminService.filterEditor(spec,page);
        return  ResponseEntity.ok().body(ApiResponse.<org.springframework.data.domain.Page<UserResponse>>builder()
                .statusCode(200)
                .message("Get all editor success")
                        .data(userResponsePage)
                .build());
    }
    @GetMapping("/post/handle")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<PostResponse>>> handlePost (@Filter Specification<Post> spec, @Page Pageable page){
        org.springframework.data.domain.Page<PostResponse> userResponsePage=   adminService.handlePost(spec,page);
        return  ResponseEntity.ok().body(ApiResponse.<org.springframework.data.domain.Page<PostResponse>>builder()
                .statusCode(200)
                .message("Get all editor success")
                .data(userResponsePage)
                .build());
    }
    @GetMapping("/post/change/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> changStatusPost  (@PathVariable String id,@RequestParam("status") PostStatus status){
        PostResponse postResponse=    postService.changStatusPost(id,status);
        return  ResponseEntity.ok().body(ApiResponse.<PostResponse>builder()
                .statusCode(200)
                .message("Get all editor success")
                .data(postResponse)
                .build());
    }
    @DeleteMapping("/post/delete/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> deletePost  (@PathVariable String id){
          postService.deletePost(id);
        return  ResponseEntity.ok().body(ApiResponse.<PostResponse>builder()
                .statusCode(200)
                .message("Delete post success")
                .build());
    }

}
