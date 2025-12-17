package loveduong.duongcute.service;

import loveduong.duongcute.dto.request.ProductRequest;
import loveduong.duongcute.dto.response.ProductResponse;
import loveduong.duongcute.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Map;

public interface ProductService {
    public ProductResponse handleCreateProduct(ProductRequest productRequest);
    public List<ProductResponse> getAllProduct();
    public Page<ProductResponse> filterProduct(Specification<Product> spec, Pageable page);
    void deleteProduct(Long id);
    Long getStockById(Long id);
}
