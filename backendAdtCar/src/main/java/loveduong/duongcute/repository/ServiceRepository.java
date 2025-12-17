package loveduong.duongcute.repository;

import loveduong.duongcute.entity.Service;
import loveduong.duongcute.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service, String> {
}
