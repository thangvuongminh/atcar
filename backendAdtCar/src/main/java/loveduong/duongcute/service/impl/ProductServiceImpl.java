package loveduong.duongcute.service.impl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.request.ProductRequest;
import loveduong.duongcute.dto.response.ProductResponse;
import loveduong.duongcute.entity.Product;
import loveduong.duongcute.repository.ProductRepository;
import loveduong.duongcute.service.FilesStorageService;
import loveduong.duongcute.service.ProductService;
import loveduong.duongcute.service.exception.AppException;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import loveduong.duongcute.service.mapper.ProductMapper;
import loveduong.duongcute.util.SearchCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {
    private ProductRepository productRepository;
    private FilesStorageService filesStorageService;
    private ProductMapper productMapper;
    private Path productPath= Paths.get("D:/Product");
    public ProductServiceImpl(ProductRepository productRepository,ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper=productMapper;
    }
    public ProductResponse handleCreateProduct(ProductRequest productRequest) {
        Product product = productMapper.toProduct(productRequest);
        String timestamp = UUID.randomUUID().toString();
        String tmp= timestamp + "_" +  productRequest.getImg().getOriginalFilename();
        try {
            Files.copy(productRequest.getImg().getInputStream(), productPath.resolve(tmp));
        } catch (IOException e) {
            throw new AppException(ExceptionEnums.NO_IDENTITY_ERROR);
        }
        product.setUrl(tmp);
        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }
    public List<ProductResponse> getAllProduct() {
        List<Product> products = productRepository.findAll();
        return productMapper.toProductResponseList(products);
    }

    @Override
    public Page<ProductResponse> filterProduct(Specification<Product> spec, Pageable page) {
        Page<Product> products = productRepository.findAll(spec, page);
        return products.map(productMapper::toProductResponse);
    }
    public void deleteProduct(Long id) {
        Product product=productRepository.findById(id).orElseThrow(()->new AppException(
                ExceptionEnums.PRODUCT_NOT_EXITS
        ));
        productRepository.deleteById(id);
    }

    @Override
    public Long getStockById(Long id) {
       Product product= productRepository.findById(id).orElseThrow(()->new AppException(ExceptionEnums.PRODUCT_NOT_EXITS));
        return  product.getQuantity();
    }

}
