package loveduong.duongcute.service.mapper;

import loveduong.duongcute.dto.request.ProductRequest;
import loveduong.duongcute.dto.response.ProductResponse;
import loveduong.duongcute.entity.Product;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toProductResponse(Product product);
    Product toProduct(ProductRequest productRequest);
    List<ProductResponse> toProductResponseList(List<Product> productList);
}
