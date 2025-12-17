package loveduong.duongcute.repository;

import loveduong.duongcute.entity.Permission;
import loveduong.duongcute.entity.User;
import loveduong.duongcute.util.constants.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository  extends JpaRepository<Permission, Long> {
    Permission findByName(String name);
    @Query("SELECT p FROM Permission p JOIN p.roles r WHERE r.role=:role")
    List<Permission>  searchPermission(@Param("role") Roles role);
}
