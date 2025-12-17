package loveduong.duongcute.controller;

import com.turkraft.springfilter.boot.Filter;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.response.UserResponse;
import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.entity.Category;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CategoryController {
    CategoryService categoryService;
    @GetMapping("/category/all")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategory (){
        List<Category> categoryList=categoryService.getAllCategory();
        return  ResponseEntity.ok().body(ApiResponse.<List<Category>>builder()
                .statusCode(200)
                .message("Get all category success")
                .data(categoryList)
                .build());
    }
}
