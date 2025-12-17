package loveduong.duongcute.util;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import loveduong.duongcute.entity.Permission;
import loveduong.duongcute.repository.PermissionRepository;
import loveduong.duongcute.repository.UserRepository;
import loveduong.duongcute.service.exception.AppException;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("userDetailsService")
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService  implements UserDetailsService  {
    UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        loveduong.duongcute.entity.User user =
                userRepository.findByEmail(email);
        if(user==null){
            throw new UsernameNotFoundException("INFO NOT MATCHES");
        }
        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole().getRole().name())) ;
        return new User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
