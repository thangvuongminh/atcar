package loveduong.duongcute.service.impl;

import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import loveduong.duongcute.dto.request.CreateDiscountRequest;
import loveduong.duongcute.dto.request.UserRequest;
import loveduong.duongcute.dto.response.BookingResponse;
import loveduong.duongcute.dto.response.CouponResponse;
import loveduong.duongcute.dto.response.PostResponse;
import loveduong.duongcute.dto.response.UserResponse;
import loveduong.duongcute.entity.Booking;
import loveduong.duongcute.entity.Post;
import loveduong.duongcute.entity.Role;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.redis.CouponRedis;
import loveduong.duongcute.repository.BookingRepository;
import loveduong.duongcute.repository.PostRepository;
import loveduong.duongcute.repository.RoleRepository;
import loveduong.duongcute.repository.UserRepository;
import loveduong.duongcute.repository.redis.CouponRepository;
import loveduong.duongcute.service.AdminService;
import loveduong.duongcute.service.EmailService;
import loveduong.duongcute.service.exception.AppException;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import loveduong.duongcute.service.mapper.PostMapstruct;
import loveduong.duongcute.service.mapper.UserMapstruct;
import loveduong.duongcute.util.constants.BookingStatus;
import loveduong.duongcute.util.constants.Roles;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true,level = AccessLevel.PRIVATE)
public class AdminServiceImpl implements AdminService {
    private static final String PATTERN_FORMAT = "HH:mm dd/MM/yyyy";
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(PATTERN_FORMAT);
    CouponRepository couponRepository;
    RoleRepository roleRepository;
    PostRepository postRepository;
    PostMapstruct postMapstruct;
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    BookingRepository bookingRepository;
    UserMapstruct userMapstruct;
    EmailService emailService;
    @Cacheable(value = "allusers")
    @Override
    public List<UserResponse> getAllUsers() {
       List<User> allUsers= userRepository.findAll();
        return userMapstruct.toListUserResponse(allUsers);
    }

    @Override
    public void createDiscount(CreateDiscountRequest createDiscountRequest) {
        Set<String> set = new HashSet<>();
        set.add("ADMIN");
          CouponRedis couponRedis = CouponRedis.builder()
                  .code(createDiscountRequest.getCode())
                  .discount(createDiscountRequest.getDiscount())
                  .desc(createDiscountRequest.getDesc())
                  .expire(999999999).expireAt(createDiscountRequest.getExpire())
                  .userUse(set)
                  .build();
          couponRepository.save(couponRedis);
    }
    @Override
    public List<CouponResponse> getAllDiscount() {
        List<CouponRedis> couponRedis= (List<CouponRedis>) couponRepository.findAll();

        List<CouponResponse> couponResponses= new ArrayList<>();
        for(CouponRedis couponRedis1:couponRedis){
            couponResponses.add(CouponResponse.builder()
                            .code(couponRedis1.getCode())
                            .discount(couponRedis1.getDiscount())
                            .desc(couponRedis1.getDesc())
                            .expireAt(couponRedis1.getExpireAt())
                            .expire(couponRedis1.getExpire())

                    .build());
        }
        return  couponResponses;
    }
    @Override
    public void handleSendDiscount(String code) {
       ;
        CouponRedis couponRedis=couponRepository.findByCode(code);
        if(couponRedis==null || couponRedis.getExpire() != 999999999){
            throw  new AppException(ExceptionEnums.COUPON_NOT_EXIST);
        }
        Role role = roleRepository.findByRole(Roles.USER);
        List<User> users = userRepository.findByRole(role);

        LocalDateTime dateTime  =couponRedis.getExpireAt();
        Instant comingExpire =dateTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();
        Instant instant= ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();

        couponRedis.setExpire(comingExpire.getEpochSecond()-instant.getEpochSecond());
        couponRepository.save(couponRedis);
        DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("mm:HH dd-MM-yyyy");
        Context context = new Context();
        context.setVariable("code", code);

        context.setVariable("discountPercent", couponRedis.getDiscount());
        context.setVariable("serviceDescription", couponRedis.getDesc());
        context.setVariable("expire", myFormatObj.format(couponRedis.getExpireAt()));
        for (User user : users) {
            context.setVariable("name", user.getName());
            try {
                emailService.sendEmail(
                        user.getEmail(),
                        "Ưu đãi cực sốc có hạn",
                        "discountTemplate",
                        context
                );
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    public UserResponse createEditor(UserRequest userRequest) {
        if (userRepository.findByEmail(userRequest.getEmail()) != null) {
            throw  new AppException(ExceptionEnums.EMAIL_EXIST);
        }
        Role role=roleRepository.findByRole(Roles.EDITOR);
        User user = userMapstruct.toUser(userRequest);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        UserResponse userResponse = userMapstruct.toUserResponse(user);
        userResponse.setRoleName(role.getRole().name());
        return userResponse;
    }

    @Override
    public void deleteEditor(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new AppException(ExceptionEnums.USER_NOT_EXIST);
        }
        userRepository.delete(user);
    }

    @Override
    public Page<PostResponse> handlePost(Specification<Post> spec, Pageable page) {
        Page<Post> posts= postRepository.findAll(spec,page);
        return  posts.map(postMapstruct::toPostResponse);
    }

    @Override
    public List<UserResponse> getAllEditor() {
        Role role=roleRepository.findByRole(Roles.EDITOR);
        List<User> allUsers= userRepository.findByRole(role);
        return userMapstruct.toListUserResponse(allUsers);
    }


    public Page<UserResponse> filterEditor(Specification<User> spec, Pageable pageable) {
        Specification<User> specification =(root,query,builder)->builder.equal(root.get("role").get("role"),Roles.EDITOR);
        Specification<User> defaultSpecification =(spec==null)?specification:specification.and(spec);
        Page<User> page=userRepository.findAll(defaultSpecification,pageable);
        return page.map(userMapstruct::toUserResponse);
    }

    @Override
    public void deleteDiscount(String code) {
        CouponRedis couponRedis=couponRepository.findByCode(code);
        if(couponRedis==null || couponRedis.getExpire() < 800000000){
            throw  new AppException(ExceptionEnums.COUPON_NOT_VALID);
        }
        couponRepository.delete(couponRedis);
    }
}
