package loveduong.duongcute.repository.redis;

import loveduong.duongcute.redis.PasswordTokenRedis;
import org.springframework.data.repository.CrudRepository;

public interface PasswordTokenRedisRepository extends CrudRepository<PasswordTokenRedis, String> {
    PasswordTokenRedis findByToken(String  token);
    void deleteByToken(String token);
}
