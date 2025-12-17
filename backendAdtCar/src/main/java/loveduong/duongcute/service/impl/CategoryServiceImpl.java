package loveduong.duongcute.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.entity.Category;
import loveduong.duongcute.repository.CategoryRepository;
import loveduong.duongcute.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;
    @Override
    public List<Category> getAllCategory() {
        List<Category> categories= categoryRepository.findAll();
        return categories;
    }
}
