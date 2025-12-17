package loveduong.duongcute.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.response.ResponseChatClientForUser;
import loveduong.duongcute.entity.ApiResponse;
import loveduong.duongcute.service.ChatClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {
    ChatClientService chatClientService;
    @GetMapping("user/chat")
    public ResponseEntity<ApiResponse<List<ResponseChatClientForUser>>> chatClientForUser(@RequestParam("message") String message) {
        List<ResponseChatClientForUser> response = chatClientService.chatClientUser(message);
        return  ResponseEntity.ok(ApiResponse.<List<ResponseChatClientForUser>>builder()
                .statusCode(200)
                .message("Chat success")
                .data(response)
                .build());
    }
    @GetMapping("super/user/chat")
    public ResponseEntity<ApiResponse<String>> chatClientEditor(@RequestParam("message") String message){
        String response= chatClientService.chatClientEditor(message);
        return  ResponseEntity.ok().body(ApiResponse.<String>builder().message("Chat success").statusCode(200).data(response)
                .build());
    }
}
