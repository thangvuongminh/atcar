package loveduong.duongcute.repository;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.LockModeType;
import loveduong.duongcute.entity.Booking;
import loveduong.duongcute.entity.Retail;
import loveduong.duongcute.util.constants.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String>, JpaSpecificationExecutor<Booking> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select b from Booking b
        where b.retail = :retail
          and b.timeBooking = :date
          and b.startTime = :time
          and b.status = :status
    """)
    List<Booking> lockSlot(@Param("retail") Retail retail,
                           @Param("date") LocalDate date,
                           @Param("time") LocalTime time,
                           @Param("status") BookingStatus status);
    boolean existsByPhoneAndTimeBookingAndStatusNot(String phone, LocalDate timeBooking, BookingStatus status);
}
