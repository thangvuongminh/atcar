package loveduong.duongcute.repository;

import io.lettuce.core.dynamic.annotation.Param;
import loveduong.duongcute.entity.Role;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import loveduong.duongcute.entity.User;

import java.util.List;

@Repository

public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
  User findByEmail(String email);

  Boolean existsByEmail(String email);

    List<User> findByRole(Role role);
}
