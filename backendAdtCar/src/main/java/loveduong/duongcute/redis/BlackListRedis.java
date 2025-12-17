package loveduong.duongcute.redis;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RedisHash("back_list")
public class BlackListRedis {
    @Id
    String email;
    @TimeToLive(unit = TimeUnit.SECONDS)
    Long expire;
    String token;
}
