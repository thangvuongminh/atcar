package loveduong.duongcute.redis;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

import java.util.concurrent.TimeUnit;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RedisHash("forget_password")
public class PasswordTokenRedis {
    @Id
    String email;
    @TimeToLive(unit = TimeUnit.SECONDS)
    long expireTime;
    @Indexed
    String token;
}
