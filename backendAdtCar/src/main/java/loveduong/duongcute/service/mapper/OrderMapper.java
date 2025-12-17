package loveduong.duongcute.service.mapper;

import loveduong.duongcute.dto.response.OrderResponse;
import loveduong.duongcute.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ValueMapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "invoicesProductResponses",source = "invoiceProducts")
    OrderResponse toOrderResponse(Order order);

    Set<OrderResponse> toOrderResponseSet(Set<Order> orders);
}
