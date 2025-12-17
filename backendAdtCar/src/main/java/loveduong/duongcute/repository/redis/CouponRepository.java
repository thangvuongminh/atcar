package loveduong.duongcute.repository.redis;

import loveduong.duongcute.redis.BlackListRedis;
import loveduong.duongcute.redis.CouponRedis;
import org.springframework.data.repository.CrudRepository;

public interface CouponRepository   extends CrudRepository<CouponRedis,String> {
    CouponRedis findByCode(String code);
}
