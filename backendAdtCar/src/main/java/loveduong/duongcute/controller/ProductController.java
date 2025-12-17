package loveduong.duongcute.controller;

import com.turkraft.springfilter.boot.Filter;
import com.turkraft.springfilter.boot.Page;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.request.ProductRequest;
import loveduong.duongcute.dto.response.ProductResponse;
import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.entity.Product;
import loveduong.duongcute.service.ProductService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("product")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductController {
    ProductService productService;
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductResponse>> handleCreateProduct(@ModelAttribute ProductRequest productRequest){
        ProductResponse productResponse= productService.handleCreateProduct(productRequest);
        return  ResponseEntity.ok().body(ApiResponse.<ProductResponse>builder()
                .statusCode(200)
                .message("Message  create product success")
                .data(productResponse)
                .build());
    }
    @PostMapping("/all")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProduct(){
        List<ProductResponse>  allProduct= productService.getAllProduct();
        return  ResponseEntity.ok().body(ApiResponse.<List<ProductResponse>>builder()
                .statusCode(200)
                .message("Message  get product success")
                .data(allProduct)
                .build());
    }

    @GetMapping("/stock/{id}")
    public ResponseEntity<Long> getProductStock(@PathVariable Long id) {
        Long stock = productService.getStockById(id);
        return ResponseEntity.ok(stock);
    }
    @GetMapping("/home")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<ProductResponse>>> filterProduct(@Filter Specification<Product> spec,@Page Pageable page){
        org.springframework.data.domain.Page<ProductResponse> productResponses=    productService.filterProduct(spec,page);
        return  ResponseEntity.ok().body(ApiResponse.<org.springframework.data.domain.Page<ProductResponse>>builder()
                .statusCode(200)
                .message("Message  get product success")
                        .data(productResponses)
                .build());
    }
}
