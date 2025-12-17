package loveduong.duongcute.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import loveduong.duongcute.redis.BlackListRedis;
import loveduong.duongcute.repository.redis.BlackListRepository;
import loveduong.duongcute.repository.redis.RefreshTokenRedisRepository;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
@Component
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true,level = AccessLevel.PRIVATE)
@Slf4j
public class RedisFilterConfiguration  extends GenericFilterBean {
    RefreshTokenRedisRepository refreshTokenRedisRepository;
    RestAuthEntryPoint restAuthEntryPoint;
    JwtDecoder jwtDecoder;
    BlackListRepository blackListRepository;
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        if (authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())) {
            String email = authentication.getName();

            BlackListRedis blackListRedis = blackListRepository.findByEmail(email);
            if (blackListRedis != null) {
                restAuthEntryPoint.commence((HttpServletRequest) request, (HttpServletResponse) response, new InsufficientAuthenticationException("User is blacklisted"));
                return;
            }
        }
        chain.doFilter(request, response);
    }
}
