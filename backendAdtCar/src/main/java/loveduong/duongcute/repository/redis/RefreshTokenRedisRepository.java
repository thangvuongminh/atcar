package loveduong.duongcute.repository.redis;
import loveduong.duongcute.redis.RefreshTokenRedis;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRedisRepository extends CrudRepository<RefreshTokenRedis, String> {
    RefreshTokenRedis findByEmail(String email);
    void deleteByEmail(String email);
}
