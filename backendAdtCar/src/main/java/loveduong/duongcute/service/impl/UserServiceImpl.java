package loveduong.duongcute.service.impl;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import loveduong.duongcute.dto.request.BookingRequest;
import loveduong.duongcute.dto.request.OrderRequest;
import loveduong.duongcute.dto.request.UserUpdateRequest;
import loveduong.duongcute.dto.response.*;
import loveduong.duongcute.entity.*;
import loveduong.duongcute.redis.CouponRedis;
import loveduong.duongcute.redis.PasswordTokenRedis;
import loveduong.duongcute.repository.*;
import loveduong.duongcute.repository.redis.CouponRepository;
import loveduong.duongcute.repository.redis.PasswordTokenRedisRepository;
import loveduong.duongcute.service.EmailService;
import loveduong.duongcute.service.MomoService;
import loveduong.duongcute.service.exception.AppException;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import loveduong.duongcute.service.mapper.InvoiceMapper;
import loveduong.duongcute.service.mapper.OrderMapper;
import loveduong.duongcute.service.mapper.ProductMapper;
import loveduong.duongcute.util.constants.BookingStatus;
import loveduong.duongcute.util.constants.OrderStatus;
import loveduong.duongcute.util.constants.PostStatus;
import loveduong.duongcute.util.constants.Roles;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.request.UserRequest;
import loveduong.duongcute.service.UserService;
import loveduong.duongcute.service.mapper.UserMapstruct;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;

@Service

@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class UserServiceImpl implements UserService {
  UserRepository userRepository;
  UserMapstruct userMapstruct;
  ProductRepository productRepository;
  PasswordEncoder passwordEncoder;
  RoleRepository roleRepository;
  ProductMapper productMapper;
  RedisTemplate<Object, Object> redisTemplate;
  CouponRepository cuponRepository;
  MomoService momoService;
  OrderRepository orderRepository;
  BookingRepository bookingRepository;
  OrderMapper orderMapper;
  InvoiceProductsRepository invoiceProductsRepository;
  RetailRepository retailRepository;
  public   Role role;
    private final InvoiceMapper invoiceMapper;

    UserServiceImpl(UserRepository userRepository, UserMapstruct userMapstruct, PasswordEncoder passwordEncoder, RoleRepository roleRepository, RedisTemplate<Object, Object> redisTemplate, ProductRepository productRepository, ProductMapper productMapper, CouponRepository cuponRepository, OrderRepository orderRepository, MomoService momoService, OrderMapper orderMapper, InvoiceProductsRepository invoiceProductsRepository, InvoiceMapper invoiceMapper,BookingRepository bookingRepository ,RetailRepository retailRepository) {
        this.userRepository = userRepository;
        this.userMapstruct = userMapstruct;
        this.passwordEncoder = passwordEncoder;
        this.orderRepository=orderRepository;
        this.roleRepository = roleRepository;
        this.redisTemplate=redisTemplate;
        this.cuponRepository=cuponRepository;
        this.role=roleRepository.findByRole(Roles.USER);
        this.productRepository=productRepository;
        this.retailRepository=retailRepository;
        this.productMapper=productMapper;
        this.momoService=momoService;
        this.orderMapper=orderMapper;
        this.invoiceProductsRepository=invoiceProductsRepository;
        this.invoiceMapper = invoiceMapper;
        this.bookingRepository=bookingRepository;
    }
  public UserResponse createUser(UserRequest userRequest) {

      if (userRepository.existsByEmail(userRequest.getEmail())) {
          throw  new AppException(ExceptionEnums.EMAIL_EXIST);
      }
    User user = userMapstruct.toUser(userRequest);
      user.setRole(role);
      user.setPassword(passwordEncoder.encode(user.getPassword()));
      userRepository.save(user);
      UserResponse userResponse = userMapstruct.toUserResponse(user);
    return userResponse;
  }
  @Cacheable(value = "users",key = "#email")
  public UserResponse getUser(String email) {
      User user = userRepository.findByEmail(email);
      UserResponse userResponse = userMapstruct.toUserResponse(user);
    return userResponse;
  }

    @Override
    public UserResponse getProfile() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        User user=userRepository.findByEmail(authentication.getName());
        UserResponse userResponse = userMapstruct.toUserResponse(user);
        return userResponse;
    }

    @Override
    public void addProduct(Long id) {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        Object cachedProduct  = redisTemplate.opsForValue().get(authentication.getName());
        if (cachedProduct == null) {
            Set<Long> ids = new HashSet<>();
            ids.add(id);
            redisTemplate.opsForValue().set(authentication.getName(), ids, 86400, TimeUnit.SECONDS);
            return;
        }
        Set<Long> ids = (Set<Long>) redisTemplate.opsForValue().get(authentication.getName());
        ids.add(id);
        redisTemplate.opsForValue().set(authentication.getName(), ids, 86400, TimeUnit.SECONDS);
    }

    @Override
    public List<ProductResponse> getAllCard() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        Set<Long> ids = (Set<Long>) redisTemplate.opsForValue().get(authentication.getName());
        if(ids==null){return null;}
        List<Product> productList = new ArrayList<>();
        Product product=null;
        for (Long id : ids) {
            product= productRepository.findById(id).orElseThrow(()-> new AppException(ExceptionEnums.POST_NOT_EXIST));
            productList.add(product);
        }
        return productMapper.toProductResponseList(productList);
    }

    @Override
    public UserResponse updateUser(UserUpdateRequest userUpdateRequest) {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        User user=userRepository.findByEmail(authentication.getName());
        user.setName(userUpdateRequest.getName());
        user.setPhone(userUpdateRequest.getPhone());
        user.setAddress(userUpdateRequest.getAddress());
        userRepository.save(user);
        return userMapstruct.toUserResponse(user);
    }

    @Override
    public void deleteCard(Long id) {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        Set<Long> ids = (Set<Long>) redisTemplate.opsForValue().get(authentication.getName());
        ids.remove(id);
        redisTemplate.opsForValue().set(authentication.getName(), ids, 86400, TimeUnit.SECONDS);
    }


    @Override
    public void handleDeleteUsers(String id) {
        User user=userRepository.findById(id).orElseThrow(() -> new  AppException(ExceptionEnums.USER_NOT_EXIST) );
        userRepository.delete(user);
    }

    @Override
    public Integer isValidCoupon(String coupon) {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        CouponRedis couponRedis = cuponRepository.findByCode(coupon);
        if(couponRedis==null || couponRedis.getUserUse().contains(authentication.getName()) || couponRedis.getExpire() > 800000000){
            return -1;
        }

        return couponRedis.getDiscount();
    }

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest orderRequest) {
        if (orderRequest.getProductBuys()==null){
            throw  new AppException(ExceptionEnums.NO_PRODUCT_SELECTED);
        }
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        User user=userRepository.findByEmail(authentication.getName());
        Order o = Order.builder()
                .tax(UUID.randomUUID().toString())
                .orderStatus(OrderStatus.PENDING_PAYMENT)
                .create_At(LocalDateTime.now())
                .codeDiscount(orderRequest.getCodeDiscount())
                .orderExpireTime(Instant.now().plus(5, ChronoUnit.MINUTES))
                .note(orderRequest.getNote())
                .totalPrice(Math.floor(orderRequest.getTotalPrice()*100)/100)
                .user(user)
                .build();
        orderRepository.save(o);
        Product product=null;
        InvoiceProduct invoiceProduct;
        Set<InvoicesProductResponse> ips=new HashSet<>();
        InvoicesProductResponse invoicesProductResponse=null;
        for(OrderRequest.ProductBuy productBuy: orderRequest.getProductBuys()){
            product=productRepository.findByIdForUpdate(productBuy.getProductId()).orElseThrow(()->new AppException(ExceptionEnums.PRODUCT_NOT_EXITS));
            long stock= product.getQuantity() -  productBuy.getQuantity();
            if(stock<0){
                throw new AppException(ExceptionEnums.PRODUCT_IS_BUIED);
            }
            invoiceProduct=InvoiceProduct.builder()
                    .quantity(productBuy.getQuantity())
                    .price(productBuy.getPrice())
                    .order(o)
                    .product(product)
                    .build();
            product.setQuantity(stock);
            invoicesProductResponse=InvoicesProductResponse.builder()
                    .productResponse(productMapper.toProductResponse(product))
                    .quantity(productBuy.getQuantity())
                    .price(productBuy.getPrice())
                    .build();
            ips.add(invoicesProductResponse);
            invoiceProductsRepository.save(invoiceProduct);
        }
        return OrderResponse.builder()
                .id(o.getId())
                .codeDiscount(o.getCodeDiscount())
                .totalPrice(o.getTotalPrice())
                .tax(o.getTax())
                .percent(o.getPercent())
                .orderStatus(o.getOrderStatus())
                .orderExpireTime(o.getOrderExpireTime())
                .invoicesProductResponses(ips)
                .create_At(o.getCreate_At())
                .note(o.getNote())
                .build();
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Set<OrderResponse> getAllOrder() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        User user=userRepository.findByEmail(authentication.getName());

        Set<Order> orderList=  user.getOrders();
        Set<OrderResponse> orderResponses = new HashSet<>();
        OrderResponse orderResponse=null;
        for(Order order: orderList){
            orderResponse=OrderResponse.builder()
                    .id(order.getId())
                    .tax(order.getTax())
                    .orderStatus(order.getOrderStatus())
                    .note(order.getNote())
                    .totalPrice(order.getTotalPrice())
                    .orderExpireTime(order.getOrderExpireTime())
                    .codeDiscount(order.getCodeDiscount())
                    .create_At(order.getCreate_At())
                    .invoicesProductResponses(invoiceMapper.toInvoicesProductResponseSet(order.getInvoiceProducts()))
                    .build();
            orderResponses.add(orderResponse);
        }

        return orderResponses;
    }

    @Override
    public MomoResponse paymentOrder(OrderRequest orderRequest) {
        return  momoService.createPaymentRequest(orderRequest);
    }

    @Override
    @Transactional
    public void handleBookingCalendar(BookingRequest req) {
        if (req == null) {
            throw new IllegalArgumentException("Request không hợp lệ");
        }
        if (req.getRetailId() == null) {
            throw new IllegalArgumentException("Thiếu thông tin chi nhánh");
        }
        if (req.getTimeBooking() == null || req.getStartTime() == null) {
            throw new IllegalArgumentException("Thiếu ngày hoặc giờ đặt lịch");
        }
        if (req.getName() == null || req.getName().isBlank()) {
            throw new IllegalArgumentException("Thiếu tên khách hàng");
        }
        if (req.getPhone() == null || req.getPhone().isBlank()) {
            throw new IllegalArgumentException("Thiếu số điện thoại");
        }

        LocalDate minDate = LocalDate.now().plusDays(2);
        if (req.getTimeBooking().isBefore(minDate)) {
            throw new IllegalStateException("Phải đặt lịch trước ít nhất 2 ngày");
        }
        Retail retail = retailRepository.findById(req.getRetailId())
                .orElseThrow(() -> new IllegalArgumentException("Retail không tồn tại"));
        BookingStatus COUNT_STATUS = BookingStatus.PENDING;

        List<Booking> locked = bookingRepository.lockSlot(
                retail,
                req.getTimeBooking(),
                req.getStartTime(),
                COUNT_STATUS
        );

        if (locked.size() >= 3) {
            throw new IllegalStateException("Khung giờ này đã đủ 3 người, vui lòng chọn giờ khác");
        }
        Booking booking = Booking.builder()
                .name(req.getName().trim())
                .phone(req.getPhone().trim())
                .timeBooking(req.getTimeBooking())
                .startTime(req.getStartTime())
                .status(BookingStatus.PENDING)
                .note(req.getNote())
                .retail(retail)
                .build();

        bookingRepository.save(booking);
    }

    @Scheduled(fixedDelay = 10000)
    @Transactional
    public void  checkOrderStatus(){
        List<Order> orderList=orderRepository.findPendingReview(OrderStatus.PENDING_PAYMENT,Instant.now());
        Product product=null;
        for(Order order: orderList){
            for(InvoiceProduct invoiceProduct: order.getInvoiceProducts()){
                product=invoiceProduct.getProduct();
                product.setQuantity(product.getQuantity()+invoiceProduct.getQuantity());
            }
            order.setOrderStatus(OrderStatus.EXPIRED);
        }
    }
}
