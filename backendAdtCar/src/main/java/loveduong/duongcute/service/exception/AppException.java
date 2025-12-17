package loveduong.duongcute.service.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
@Getter
public class AppException extends  RuntimeException{
    private final ExceptionEnums exceptionEnums;
    public AppException( ExceptionEnums exceptionEnums){
        this.exceptionEnums=exceptionEnums;
    }
}
