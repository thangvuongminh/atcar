package loveduong.duongcute.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.util.constants.BookingStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;
    String phone;

    LocalDate timeBooking;
    LocalTime startTime;
    @Enumerated(EnumType.STRING)
    BookingStatus status ;

    @Column(columnDefinition = "MEDIUMTEXT")
    String note;

    @ManyToOne
    @JoinColumn(name = "retail_id")
    Retail retail;

}
