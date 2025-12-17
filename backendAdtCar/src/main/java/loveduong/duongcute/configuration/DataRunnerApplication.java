package loveduong.duongcute.configuration;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.entity.*;
import loveduong.duongcute.repository.*;
import loveduong.duongcute.util.constants.Roles;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true,level = AccessLevel.PRIVATE)
public class DataRunnerApplication  implements CommandLineRunner {
    PermissionRepository permissionRepository;
    RoleRepository roleRepository;
    ServiceRepository serviceRepository;
    DetailServiceRepository detailServiceRepository;
    CategoryRepository categoryRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    RetailRepository retailRepository;
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        String[] roleUser={"VIEW_USER","UPDATE_USER","USER_CHAT"};
        String[] roleEditor ={"UPDATE_POST","DELETE_POST","CREATE_POST","VIEW_POST","VIEW_USER","UPDATE_USER","UPLOAD_DOCUMENT","EDITOR_CHAT"};
        String[] rolesAdmin ={"DELETE_USER","CREATE_USER","VIEW_ALL_USER","CREATE_PRODUCT"};
        if (retailRepository.count() == 0) {
            Retail r1 = Retail.builder()
                    .name("ADT Car Hà Nội")
                    .address("Cầu Giấy, Hà Nội")
                    .hotline("1900 1111")
                    .open_hours("08:00 - 17:30")
                    .build();

            Retail r2 = Retail.builder()
                    .name("ADT Car TP.HCM")
                    .address("Quận 7, TP.HCM")
                    .hotline("1900 2222")
                    .open_hours("08:00 - 17:30")
                    .build();

            Retail r3 = Retail.builder()
                    .name("ADT Car Đà Nẵng")
                    .address("Hải Châu, Đà Nẵng")
                    .hotline("1900 3333")
                    .open_hours("08:00 - 17:30")
                    .build();

            retailRepository.save(r1);
            retailRepository.save(r2);
            retailRepository.save(r3);
        }


        if(roleRepository.count()==0){
            Role user = Role.builder()
                    .role(Roles.USER)
                    .build();
            Role editor = Role.builder()
                    .role(Roles.EDITOR)
                    .build();
            Role admin = Role.builder()
                    .role(Roles.ADMIN)
                    .build();
            roleRepository.save(user);
            roleRepository.save(editor);
            roleRepository.save(admin);
            handleAdd(roleUser,user);
            handleAdd(roleEditor,editor);
            handleAdd(roleUser,admin);
            handleAdd(roleEditor,admin);
            handleAdd(rolesAdmin,admin);
        }
        if (serviceRepository.count()==0){
            Service service = Service.builder().name("Bảo dưỡng").build();
            Service service1 = Service.builder().name("Sửa chữa chung").build();
            Service service2 = Service.builder().name("Đồng sơn").build();
            DetailService detailService =DetailService.builder()
                    .name("Bão dưỡng định kỳ cấp nhỏ")
                    .price(400)
                    .service(service)
                    .build();
            DetailService detailService1 =DetailService.builder()
                    .name("Bão dưỡng định kỳ cấp trung bình")
                    .price(1100)
                    .service(service)
                    .build();
            DetailService detailService2 =DetailService.builder()
                    .name("Bão dưỡng định kỳ cấp lớn")
                    .price(4000)
                    .service(service)
                    .build();
            serviceRepository.save(service);
            detailServiceRepository.save(detailService);
            detailServiceRepository.save(detailService1);
            detailServiceRepository.save(detailService2);
            DetailService detailService11 =DetailService.builder()
                    .name("Hệ thống phanh")
                    .price(100)
                    .service(service)
                    .build();
            DetailService detailService111 =DetailService.builder()
                    .name("Hệ thống lái")
                    .price(4000)
                    .service(service)
                    .build();
            DetailService detailService21 =DetailService.builder()
                    .name("Hệ thống điện, điều hòa")
                    .price(800)
                    .service(service)
                    .build();
            DetailService detailService112 =DetailService.builder()
                    .name("Hệ thống làm mát")
                    .price(500)
                    .service(service)
                    .build();
            DetailService detailService1112 =DetailService.builder()
                    .name("Hệ thống treo/gầm")
                    .price(900)
                    .service(service)
                    .build();
            DetailService detailService212 =DetailService.builder()
                    .name("Hệ thống nội thất")
                    .price(800)
                    .service(service)
                    .build();
            DetailService detailService212h =DetailService.builder()
                    .name("Chẩn đoán đèn báo lỗi và cập nhật phần mềm")
                    .price(150)
                    .service(service)
                    .build();
            serviceRepository.save(service1);
            detailServiceRepository.save(detailService11);
            detailServiceRepository.save(detailService111);
            detailServiceRepository.save(detailService21);
            detailServiceRepository.save(detailService112);
            detailServiceRepository.save(detailService1112);
            detailServiceRepository.save(detailService212);
            detailServiceRepository.save(detailService212h);
            serviceRepository.save(service2);
            DetailService detailService1121 =DetailService.builder()
                    .name("Thay thế chi tiết thân vỏ")
                    .price(400)
                    .service(service)
                    .build();
            DetailService detailService11123 =DetailService.builder()
                    .name("Sơn sửa phục hồi")
                    .price(500)
                    .service(service)
                    .build();
            detailServiceRepository.save(detailService1121);
            detailServiceRepository.save(detailService11123);
        }
        if(categoryRepository.count()==0){
            Category category= Category.builder().name("marketing").build();
            Category category1= Category.builder().name("discount").build();
            Category category2= Category.builder().name("tip").build();
            categoryRepository.save(category);
            categoryRepository.save(category1);
            categoryRepository.save(category2);
        }
        User user=userRepository.findByEmail("chaudiensdk5@gmail.com");
        if(user==null){
            Role admin = roleRepository.findByRole(Roles.ADMIN);
            User user1=User.builder().email("chaudiensdk5@gmail.com")
                    .name("ADMIN")
                    .role(admin)
                    .password(passwordEncoder.encode("123456"))
                    .build();
            userRepository.save(user1);
        }
    }
    public  void handleAdd(String[] arr,Role role){
        Permission p;
        for(String permit : arr){
            p = permissionRepository.findByName(permit);
            if (p == null) {
                p= Permission.builder()
                        .name(permit)
                        .build();
            }
            p.getRoles().add(role);
            permissionRepository.save(p);
        }
    }
}
