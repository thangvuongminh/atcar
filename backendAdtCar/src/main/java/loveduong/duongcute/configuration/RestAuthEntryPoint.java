package loveduong.duongcute.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class RestAuthEntryPoint  implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        ExceptionEnums exceptionEnums = ExceptionEnums.UN_AUTHORIZED;
        response.setStatus(exceptionEnums.getStatus());
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(ApiResponse.builder()
                        .message(exceptionEnums.getMessage())
                        .statusCode(exceptionEnums.getStatus())
                .build()));
    }
}
