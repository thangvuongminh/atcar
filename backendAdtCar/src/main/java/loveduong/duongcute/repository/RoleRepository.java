package loveduong.duongcute.repository;

import loveduong.duongcute.entity.Role;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.util.constants.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository  extends JpaRepository<Role, Long> {
    Role findByRole(Roles role);
}
