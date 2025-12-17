package loveduong.duongcute.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public interface FilesStorageService {
    public List<String> save(MultipartFile[]  file,String local,Boolean saveInPost);
    public List<String> loadAll(String local);
    public void delete(List<String> filename,Boolean media);
    public void deleteMedia(String filenames,String local);
}
