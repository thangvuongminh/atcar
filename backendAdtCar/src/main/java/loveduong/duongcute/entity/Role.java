package loveduong.duongcute.entity;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.util.constants.Roles;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Role {
  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  long id;
  @Enumerated(EnumType.STRING)
  Roles role;
  @OneToMany(mappedBy="role",fetch = FetchType.LAZY)
  @JsonIgnore
  Set<User> users;
    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
     Set<Permission> permissions = new HashSet<>();
}
