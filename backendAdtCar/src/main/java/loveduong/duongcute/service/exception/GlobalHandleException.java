package loveduong.duongcute.service.exception;

import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalHandleException {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<?>> handleAppException(AppException appException){
        ExceptionEnums error = appException.getExceptionEnums();
        return  ResponseEntity.status(error.getStatus()).body(
                ApiResponse.builder()
                        .message(error.getMessage())
                        .statusCode(error.getStatus())
                        .build()
        );
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleAppException(Exception exception){
        exception.printStackTrace();
        ExceptionEnums error = ExceptionEnums.SEVER_ERROR;
        return  ResponseEntity.status(error.getStatus()).body(
                ApiResponse.builder()
                        .message(error.getMessage())
                        .statusCode(error.getStatus())
                        .build()
        );
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String,String>>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
        Map<String,String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(fieldError -> errors.put(fieldError.getField(), fieldError.getDefaultMessage()));
        ExceptionEnums error = ExceptionEnums.SEVER_ERROR;
        return  ResponseEntity.status(error.getStatus()).body(
                ApiResponse.<Map<String,String>>builder()
                        .message(error.getMessage())
                        .statusCode(error.getStatus())
                        .data(errors)
                        .build()
        );
    }
    @ExceptionHandler({UsernameNotFoundException.class, BadCredentialsException.class})
    public ResponseEntity<ApiResponse<?>> handleUserNotFound(Exception e){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST.value()).body(
                ApiResponse.builder()
                        .message("Thông tin tài khoản hoặc mật khẩu không chính xác")
                        .statusCode(HttpStatus.BAD_REQUEST.value())
                        .build()
        );
    }
}
