package loveduong.duongcute.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.util.constants.BookingStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {
    String id;
    String name;
    String phone;
    LocalDate timeBooking;
    LocalTime startTime;
    BookingStatus status;
    String note;
    Long retailId;
    String retailName;
}