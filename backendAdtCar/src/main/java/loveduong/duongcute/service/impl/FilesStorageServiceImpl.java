package loveduong.duongcute.service.impl;

import lombok.extern.slf4j.Slf4j;
import loveduong.duongcute.service.FilesStorageService;
import loveduong.duongcute.service.exception.AppException;
import loveduong.duongcute.service.exception.errors.ExceptionEnums;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service

public class FilesStorageServiceImpl implements FilesStorageService {
    private final   Path root = Paths.get("D:/upload");
    private final   Path rootPost = Paths.get("D:/posts");
    @Override
    public List<String> save(MultipartFile[] files,String local,Boolean saveInPost) {
        List<String> listUrl= new ArrayList<>();
        try {
            Path destination = root.resolve(local);
            Path destinationPost = rootPost.resolve(local);
            if(!Files.exists(destination)){
                Files.createDirectories(destination);
            }
            String timestamp;
            for(MultipartFile file:files){
                timestamp = UUID.randomUUID().toString();
                String tmp= timestamp + "_" +  file.getOriginalFilename() ;
                Files.copy(file.getInputStream(), destination.resolve(tmp));
                if(saveInPost){
                    if(!Files.exists(destinationPost)){
                        Files.createDirectories(destinationPost);
                    }
                    Files.copy(file.getInputStream(), destinationPost.resolve(tmp));
                }
                tmp=local+"/"+tmp;
                listUrl.add(tmp);
            }
            return  listUrl;
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }
    @Override
    public List<String> loadAll(String local) {
        try {
            Path destination = root.resolve(local);
            return Files.walk(destination, 1).skip(1).map(path -> path.getFileName().toString()).collect(Collectors.toList());
        } catch (IOException e) {
            return null;
        }
    }
    @Override
    public void delete(List<String> filenames,Boolean media) {
        Path rootUse=rootPost;
        if (media){
            rootUse=root;
        }
        Path destination;
        String[] tmp;
        for(String fileName: filenames){
            tmp=fileName.split("/");
            destination=rootUse.resolve(tmp[0]);
            Path ver2=destination.resolve(tmp[1]);
            try {
                Files.deleteIfExists(ver2);
            } catch (IOException e) {
                throw new AppException(ExceptionEnums.FILE_NOT_EXIST);
            }
        }
    }
    @Override
    public void deleteMedia(String filenames,String local) {
        Path destination=root.resolve(local);
        Path ver2=destination.resolve(filenames);
        try {
            Files.deleteIfExists(ver2);
        } catch (IOException e) {
            throw new AppException(ExceptionEnums.FILE_NOT_EXIST);
        }
    }
}
