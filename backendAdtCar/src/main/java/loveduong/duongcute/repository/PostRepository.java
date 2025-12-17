package loveduong.duongcute.repository;

import loveduong.duongcute.entity.Post;
import loveduong.duongcute.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository  extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
}
