package loveduong.duongcute.service;

import loveduong.duongcute.dto.request.OrderRequest;
import loveduong.duongcute.dto.response.MomoResponeStatus;
import loveduong.duongcute.dto.response.MomoResponse;

public interface MomoService {
    public MomoResponse createPaymentRequest(OrderRequest orderRequest);
    public MomoResponeStatus confirmPayment(String orderId);
}
