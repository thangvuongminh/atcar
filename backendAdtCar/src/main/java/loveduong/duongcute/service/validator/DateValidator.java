package loveduong.duongcute.service.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;

public class DateValidator implements ConstraintValidator<DateValidation, LocalDateTime>
{
    @Override
    public void initialize(DateValidation dateValidation) {

    }

    @Override
    public boolean isValid(LocalDateTime localDateTime, ConstraintValidatorContext constraintValidatorContext) {
        ZoneId zid = ZoneId.of("Asia/Ho_Chi_Minh");
        int dayBook=localDateTime.getDayOfMonth();
        LocalDateTime lt
                = LocalDateTime.now(zid);
        int dayCurrentBook=lt.getDayOfMonth();
        if(dayBook - dayCurrentBook < 1){
            return  false;
        }

        return false;
    }
}