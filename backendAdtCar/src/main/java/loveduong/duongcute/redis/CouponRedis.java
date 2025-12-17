package loveduong.duongcute.redis;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RedisHash("coupon")
public class CouponRedis {
    @Id
    String code;
    int discount;
    String desc;
    @TimeToLive(unit = TimeUnit.SECONDS)
    long expire;
    LocalDateTime expireAt;
    Set<String> userUse;
}
