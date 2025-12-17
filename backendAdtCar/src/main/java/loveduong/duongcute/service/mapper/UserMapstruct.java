package loveduong.duongcute.service.mapper;

import loveduong.duongcute.dto.response.UserResponse;
import org.mapstruct.Mapper;

import loveduong.duongcute.dto.request.UserRequest;
import loveduong.duongcute.entity.User;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapstruct {
  User toUser(UserRequest userRequest);
  UserResponse toUserResponse(User user);
  List<UserResponse> toListUserResponse(List<User> users);
}