package loveduong.duongcute.service.validator;

import jakarta.validation.Payload;

import javax.validation.Constraint;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target( {ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateValidator.class)
public @interface DateValidation {
    public String message() default "Invalid time";
    public Class<?>[] groups() default {};
    public Class<? extends Payload>[] payload() default {};
}