package loveduong.duongcute.repository;

import loveduong.duongcute.entity.Retail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RetailRepository extends JpaRepository<Retail, Long> {
}
