package loveduong.duongcute.entity;

import jakarta.persistence.*;
import lombok.*;
import loveduong.duongcute.util.constants.PostStatus;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String title;
    @ElementCollection
     @CollectionTable(name = "post_url",joinColumns = @JoinColumn(name = "post_id"))
    List<String>  urlImg;
    String description;
    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;
    @ManyToOne
    @JoinColumn(name="user_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    User user;
    String create_by;
    @Enumerated(EnumType.STRING)
    PostStatus postStatus;
    String update_by;
    Instant create_At;
    Instant update_AT;
    @PrePersist
    public void makeCreated(){
        SecurityContext securityContext= SecurityContextHolder.getContext();
        Authentication authentication=securityContext.getAuthentication();
        create_At=update_AT=Instant.now();
        create_by= authentication.getName();
        update_by = authentication.getName();
    }
    @PreUpdate
    public void makeUpdate(){
        update_AT=Instant.now();
        SecurityContext securityContext= SecurityContextHolder.getContext();
        Authentication authentication=securityContext.getAuthentication();
        update_by = authentication.getName();
    }
}
