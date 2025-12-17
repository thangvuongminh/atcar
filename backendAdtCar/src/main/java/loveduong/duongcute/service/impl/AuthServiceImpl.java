package loveduong.duongcute.service.impl;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import loveduong.duongcute.dto.request.AuthRequest;
import loveduong.duongcute.dto.response.AuthResponse;
import loveduong.duongcute.dto.response.UserResponse;
import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.entity.Permission;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.redis.BlackListRedis;
import loveduong.duongcute.redis.PasswordTokenRedis;
import loveduong.duongcute.redis.RefreshTokenRedis;
import loveduong.duongcute.repository.PermissionRepository;
import loveduong.duongcute.repository.UserRepository;
import loveduong.duongcute.repository.redis.BlackListRepository;
import loveduong.duongcute.repository.redis.PasswordTokenRedisRepository;
import loveduong.duongcute.repository.redis.RefreshTokenRedisRepository;
import loveduong.duongcute.security.SecurityUtils;
import loveduong.duongcute.service.AuthService;
import loveduong.duongcute.service.EmailService;
import loveduong.duongcute.service.exception.AppException;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import loveduong.duongcute.service.mapper.UserMapstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.w3c.dom.stylesheets.LinkStyle;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class AuthServiceImpl  implements AuthService {
    PermissionRepository permissionRepository;
    @Value("${maintenance.security.authentication.jwt.refresh-token-validity-in-seconds}")
    Long expireTime;
    @Value("${maintenance.security.authentication.jwt.base64-secret}")
    String jwtKey;
    AuthenticationManager authenticationManager;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    SecurityUtils securityUtils;
    UserMapstruct userMapstruct;
    JwtDecoder jwtDecoder;
    RefreshTokenRedisRepository refreshTokenRedisRepository;
    BlackListRepository blackListRepository;
    EmailService emailService;
    PasswordTokenRedisRepository passwordTokenRedisRepository;
    AuthServiceImpl(AuthenticationManager authenticationManager, UserRepository userRepository, SecurityUtils securityUtils, UserMapstruct userMapstruct, AuthenticationManager authenticationManager1, UserRepository userRepository1, SecurityUtils securityUtils1, UserMapstruct userMapstruct1,JwtDecoder jwtDecoder,RefreshTokenRedisRepository refreshTokenRedisRepository,BlackListRepository blackListRepository,PermissionRepository permissionRepository,  EmailService emailService,  PasswordTokenRedisRepository passwordTokenRedisRepository,  PasswordEncoder passwordEncoder){
        this.authenticationManager = authenticationManager1;
        this.userRepository = userRepository1;
        this.securityUtils = securityUtils1;
        this.userMapstruct = userMapstruct1;
        this.jwtDecoder=jwtDecoder;
        this.refreshTokenRedisRepository =refreshTokenRedisRepository;
        this.blackListRepository=blackListRepository;
        this.permissionRepository=permissionRepository;
        this.emailService=emailService;
        this.passwordTokenRedisRepository=passwordTokenRedisRepository;
        this.passwordEncoder=passwordEncoder;
    }

    @Override
    public AuthResponse handleLogin(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        SecurityContext securityContext=SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);
        User user =userRepository.findByEmail(authRequest.getEmail());
        String token = securityUtils.createToken( authRequest.getEmail(),user.getRole().getRole());
        String refreshToken = securityUtils.refreshToken( authRequest.getEmail(),user.getRole().getRole());
        List<Permission> permissions=permissionRepository.searchPermission(user.getRole().getRole());
        List<String> permissionNames=permissions.stream().map(Permission::getName).toList();

        RefreshTokenRedis refreshTokenRedis = RefreshTokenRedis.builder()
                .email(authRequest.getEmail())
                .token(refreshToken)
                .expire(expireTime)
                .build();
        refreshTokenRedisRepository.save(refreshTokenRedis);
        UserResponse userResponse=userMapstruct.toUserResponse(user);
        userResponse.setRoleName(user.getRole().getRole().name());
        userResponse.setPermissions(permissionNames);
        return  AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .userResponse(userResponse)
                .build();
    }

    public AuthResponse handleRefreshToken(String maintaincecar) {
        Jwt cookie;
        try {
            cookie=jwtDecoder.decode(maintaincecar);
        }catch (Exception e){
            throw  new AppException(ExceptionEnums.REFRESH_TOKEN_EXPRIRE);
        }
        Instant expire = cookie.getExpiresAt();
        String email =  cookie.getSubject();
        User user = userRepository.findByEmail(email);
        RefreshTokenRedis searchRefreshTokenRedis=refreshTokenRedisRepository.findByEmail(email);
        if(Instant.now().isAfter(expire) || user==null || searchRefreshTokenRedis==null ||  !searchRefreshTokenRedis.getToken().equals(maintaincecar) ){
            throw  new AppException(ExceptionEnums.REFRESH_TOKEN_EXPRIRE);
        }
        List<Permission> permissions=permissionRepository.searchPermission(user.getRole().getRole());
        List<String> permissionNames=permissions.stream().map(Permission::getName).toList();
        String token = securityUtils.createToken(email,user.getRole().getRole());
        String refreshToken = securityUtils.refreshToken(email,user.getRole().getRole());
        UserResponse userResponse=userMapstruct.toUserResponse(user);
        userResponse.setPermissions(permissionNames);
        userResponse.setRoleName(user.getRole().getRole().name());
        RefreshTokenRedis refreshTokenRedis = RefreshTokenRedis.builder()
                .email(email)
                .token(refreshToken)
                .expire(expireTime)
                .build();
        refreshTokenRedisRepository.save(refreshTokenRedis);
        return  AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .userResponse(userResponse)
                .build();
    }

    @Override
    public void handleLogout(String bearerToken) {
        SecurityContext securityContext=SecurityContextHolder.getContext();
        Authentication authentication=securityContext.getAuthentication();
        String email = authentication.getName();
        RefreshTokenRedis searchRefreshTokenRedis=refreshTokenRedisRepository.findByEmail(email);
        refreshTokenRedisRepository.deleteByEmail(email);
        String accessToken = bearerToken.substring(7);
        Jwt token = jwtDecoder.decode(accessToken);
        Instant expire = token.getExpiresAt();
        long timeExpire = expire.getEpochSecond();
        long currentTime = Instant.now().getEpochSecond();
        BlackListRedis blackListRedis=BlackListRedis.builder()
                .email(email)
                .expire(timeExpire-currentTime)
                .token(accessToken)
                .build();
        blackListRepository.save(blackListRedis);

    }
    public String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    @Override
    public void handleForgetPassword(String email) {
        User user = userRepository.findByEmail(email);
        if (user==null){
            throw  new AppException(ExceptionEnums.USER_NOT_EXIST);
        }
        PasswordTokenRedis passwordTokenRedis = PasswordTokenRedis.builder()
                .token(generateOtp())
                .email(email)
                .expireTime(300)
                .build();
        passwordTokenRedisRepository.save(passwordTokenRedis);
        Context context = new Context();context.setVariable("passwordTokenRedis",passwordTokenRedis);
        try {
            emailService.sendEmail(email,"Reset your password","resetPasswordTemplate",context);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void handleNewPassword(String otp,String newPassword) {
        PasswordTokenRedis passwordTokenRedis = passwordTokenRedisRepository.findByToken(otp);
        if (passwordTokenRedis==null ) {
            throw new AppException(ExceptionEnums.TOKEN_NOT_INVALID);
        }
        User user = userRepository.findByEmail(passwordTokenRedis.getEmail());
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordTokenRedisRepository.deleteByToken(otp);

    }
}
