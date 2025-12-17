package loveduong.duongcute.entity;

import java.time.Instant;
import java.util.Set;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String name;
  String password;
  String email;
  String phone;
  String address;
  @OneToMany(mappedBy = "user")
  Set<Post> posts;
  @ManyToOne
  @JoinColumn(name="role_id")
  Role role;
  @OneToMany(mappedBy = "user",fetch = FetchType.LAZY)
  Set<Order>orders;
}
