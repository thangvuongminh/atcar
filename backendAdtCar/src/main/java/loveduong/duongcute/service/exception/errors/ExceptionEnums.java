package loveduong.duongcute.service.exception.errors;

import lombok.Getter;
import org.springframework.http.HttpStatus;
@Getter
public enum ExceptionEnums {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(),"ERROR_404"),
    UN_AUTHORIZED(HttpStatus.UNAUTHORIZED.value(),"UN_AUTHORIZED"),
    NO_IDENTITY_ERROR(510,"ERROR_NOT_IDENTITY"),
    FOR_BIDDEN(HttpStatus.FORBIDDEN.value(),"BIDDEN"),
    SEVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR.value(), "SERVER_ERROR"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST.value(), "BAD REQUES"),
    EMAIL_EXIST(HttpStatus.CONFLICT.value(), "Email has been existed"),
    USER_NOT_EXIST(HttpStatus.NOT_FOUND.value(),"Địa chỉ email không tồn tại trong hệ thống"),
    INFO_NOT_MATCHER(HttpStatus.BAD_REQUEST.value(),"EMAIL OR PASSWORD NOT MATCH"),
    REFRESH_TOKEN_EXPRIRE(HttpStatus.BAD_REQUEST.value(),"Token expires or invalid or no exists"),
    TOKEN_NOT_INVALID(HttpStatus.BAD_REQUEST.value(),"Mã OTP sai hoặc đã hết hạn"),
    PRODUCT_NOT_EXITS(HttpStatus.BAD_REQUEST.value(),"Sản phẩm không tồn tại"),
    COUPON_NOT_EXIST(HttpStatus.NOT_FOUND.value(),"COUPON_NOT_EXIST"),
    COUPON_NOT_VALID(HttpStatus.BAD_REQUEST.value(),"code không tồn tại hoặc đang, đã áp dụng"),
    NO_PRODUCT_SELECTED(HttpStatus.BAD_REQUEST.value(),"Không sản phẩm nào được chọn"),
    // booking
    DUPLICATE_DATE_BOOKING(HttpStatus.BAD_REQUEST.value(),"You cannot schedule more than once in one day."),
    // POST
    POST_NOT_EXIST(HttpStatus.NOT_FOUND.value(), "POST_NOT_FOUND"),
    PRODUCT_IS_BUIED(HttpStatus.BAD_REQUEST.value(),"Sản phẩm đang được xử lý bởi 1 người khác vui lòng  cập nhập lại sau 5 phút"),
    FILE_NOT_EXIST(HttpStatus.NOT_FOUND.value(), "FILE_NOT_FOUND"),
    ORDER_NOT_EXIST(HttpStatus.NOT_FOUND.value(), "Đơn hàng không tồn tại"),
    POST_IS_EDITED(HttpStatus.BAD_REQUEST.value(), "POST_IS_EDITED")
    ;
    int status;
    String message;
    ExceptionEnums(int status, String message){
        this.status=status;
        this.message=message;
    }
}
