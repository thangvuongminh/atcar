package loveduong.duongcute.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import loveduong.duongcute.dto.request.AuthRequest;
import loveduong.duongcute.dto.request.ForgotPasswordRequest;
import loveduong.duongcute.dto.request.UserRequest;
import loveduong.duongcute.dto.response.AuthResponse;
import loveduong.duongcute.dto.response.UserResponse;
import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.service.UserService;
import loveduong.duongcute.service.exception.AppException;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import loveduong.duongcute.service.impl.AuthServiceImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class  AuthController {
    AuthServiceImpl authServiceImpl;
    ObjectMapper objectMapper;
    AuthController(AuthServiceImpl authServiceImpl){
        this.authServiceImpl=authServiceImpl;
    }
    @Value("${maintenance.security.authentication.jwt.refresh-token-validity-in-seconds}")
    long refreshTokenTime;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> handleLogin(@RequestBody AuthRequest authRequest){
        AuthResponse authResponse= authServiceImpl.handleLogin(authRequest);
        // them vao cookie
        ResponseCookie resCookie = ResponseCookie.from("maintaincecar", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenTime)
                .build();
        return ResponseEntity.status(200).header(HttpHeaders.SET_COOKIE,resCookie.toString()).body(ApiResponse.builder()
                        .data(authResponse)
                        .statusCode(200)
                        .message("Login success")
                .build());
    }
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<?>> handleRefreshToken(@CookieValue(name = "maintaincecar",required = false) String maintaincecar){
        if (maintaincecar == null) {
            throw  new AppException(ExceptionEnums.REFRESH_TOKEN_EXPRIRE);
        }
        AuthResponse authResponse= authServiceImpl.handleRefreshToken(maintaincecar);
        ResponseCookie resCookie = ResponseCookie.from("maintaincecar", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenTime)
                .build();
        return ResponseEntity.status(200).header(HttpHeaders.SET_COOKIE,resCookie.toString()).body(ApiResponse.builder()
                .data(authResponse)
                .statusCode(200)
                .message("Login success")
                .build());
    }
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> handleLogout(@CookieValue(name = "maintaincecar",required = false) String maintaincecar,@RequestHeader("Authorization") String bearerToken){
        if (maintaincecar == null) {
            throw  new AppException(ExceptionEnums.REFRESH_TOKEN_EXPRIRE);
        }
        authServiceImpl.handleLogout(bearerToken);
        ResponseCookie resCookie = ResponseCookie.from("maintaincecar",maintaincecar)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.status(200).header(HttpHeaders.SET_COOKIE,resCookie.toString()).body(ApiResponse.builder()
                .data(null)
                .statusCode(200)
                .message("Logout success")
                .build());
    }
    @PostMapping ("forget-password")
    public ResponseEntity<ApiResponse<UserResponse>> handleForgetPassword(@RequestParam("email") String email) {
        authServiceImpl.handleForgetPassword(email);

        return  ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("Please check your email,we send gmail reset password")
                .build());
    }
    @PostMapping("new-password")
    public ResponseEntity<ApiResponse<UserResponse>> handleNewPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest, BindingResult result) {

        authServiceImpl.handleNewPassword(forgotPasswordRequest.getOtp(),forgotPasswordRequest.getNewPassword());
        return  ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("Change password successful")
                .build());
    }
}
