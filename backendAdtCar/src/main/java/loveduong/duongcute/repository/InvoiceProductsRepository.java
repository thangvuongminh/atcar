package loveduong.duongcute.repository;

import loveduong.duongcute.entity.Category;
import loveduong.duongcute.entity.InvoiceProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceProductsRepository extends JpaRepository<InvoiceProduct, String> {
}
