package loveduong.duongcute.repository;
import io.lettuce.core.dynamic.annotation.Param;
import loveduong.duongcute.entity.Order;
import loveduong.duongcute.entity.Permission;
import loveduong.duongcute.util.constants.OrderStatus;
import loveduong.duongcute.util.constants.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    @Query("SELECT o from Order o WHERE o.orderStatus=:status and o.orderExpireTime < :expriretime")
    List<Order> findPendingReview(@Param("status") OrderStatus status, @Param("expriretime") Instant expriretime);
}
