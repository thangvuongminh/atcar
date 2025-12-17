package loveduong.duongcute.security;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.entity.Permission;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.repository.PermissionRepository;
import loveduong.duongcute.repository.UserRepository;
import loveduong.duongcute.util.constants.Roles;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
public  class SecurityUtils {

    @Value("${maintenance.security.authentication.jwt.token-validity-in-seconds}")
    long tokenValidityInSeconds;
    @Value("${maintenance.security.authentication.jwt.refresh-token-validity-in-seconds}")
    long refreshToken;
    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256;
    private final JwtEncoder jwtEncoder;
    private final PermissionRepository permissionRepository;
    public  SecurityUtils(JwtEncoder jwtEncoder,UserRepository userRepository, PermissionRepository permissionRepository){
        this.jwtEncoder = jwtEncoder;
        this.permissionRepository=permissionRepository;
    }
    public String createToken(String email, Roles role) {
        Instant now = Instant.now();
        Instant validity;
        validity = now.plus(this.tokenValidityInSeconds, ChronoUnit.SECONDS);
        List<String> roles = new ArrayList<>();
        List<Permission> permitAll = permissionRepository.searchPermission(role);
         for (Permission p:permitAll){
             roles.add(p.getName());
        }
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("role", roles)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
    public String refreshToken(String email,Roles role) {
        Instant now = Instant.now();
        Instant validity;
        validity = now.plus(refreshToken, ChronoUnit.SECONDS);
        List<String> roles = new ArrayList<>();
        List<Permission> permitAll = permissionRepository.searchPermission(role);
        for (Permission p:permitAll){
            roles.add(p.getName());
        }
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .id(UUID.randomUUID().toString())
                .claim("role",roles)
                .subject(email)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
}
