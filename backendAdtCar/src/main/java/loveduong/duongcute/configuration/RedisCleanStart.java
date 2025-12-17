package loveduong.duongcute.configuration;

import lombok.RequiredArgsConstructor;
import loveduong.duongcute.repository.redis.CouponRepository;
import loveduong.duongcute.repository.redis.RefreshTokenRedisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.CacheManager;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class RedisCleanStart {
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final CouponRepository couponRepository;
    @EventListener(ApplicationReadyEvent.class)
    public void clearRedisOnStartup() {

        refreshTokenRedisRepository.deleteAll();
        couponRepository.deleteAll();

    }
}
