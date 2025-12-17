package loveduong.duongcute.repository.redis;

import loveduong.duongcute.redis.BlackListRedis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlackListRepository  extends CrudRepository<BlackListRedis,String> {
    BlackListRedis findByEmail(String email);
}
