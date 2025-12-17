package loveduong.duongcute.service;

import loveduong.duongcute.dto.request.AuthRequest;
import loveduong.duongcute.dto.response.AuthResponse;
import org.springframework.stereotype.Service;

public interface AuthService {

    public AuthResponse handleLogin(AuthRequest authRequest);
    public void handleLogout(String accessToken);
    void handleForgetPassword(String email);
    void handleNewPassword(String otp,String password);
}
