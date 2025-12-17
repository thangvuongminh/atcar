package loveduong.duongcute.service.mapper;

import loveduong.duongcute.dto.response.InvoicesProductResponse;
import loveduong.duongcute.entity.InvoiceProduct;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;

@Mapper(componentModel = "spring",uses = {ProductMapper.class})
public interface InvoiceMapper {
    @Mapping(target="productResponse",source="product")
    InvoicesProductResponse toInvoicesProductResponse(InvoiceProduct invoicesProduct);
    Set<InvoicesProductResponse> toInvoicesProductResponseSet(Set<InvoiceProduct> invoicesProducts);
}
