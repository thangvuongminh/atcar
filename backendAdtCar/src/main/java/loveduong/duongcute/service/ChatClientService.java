package loveduong.duongcute.service;

import loveduong.duongcute.dto.response.ResponseChatClientForUser;

import java.util.List;

public interface ChatClientService {
    public String chatClientEditor(String message);
    public List<ResponseChatClientForUser> chatClientUser(String message);
}
