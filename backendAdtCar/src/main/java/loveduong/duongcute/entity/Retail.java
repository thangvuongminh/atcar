package loveduong.duongcute.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Retail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String address;
    @OneToMany(mappedBy = "retail",fetch = FetchType.LAZY)
    Set<Booking> bookings;
    String hotline;
    String open_hours;
    String name;
}
