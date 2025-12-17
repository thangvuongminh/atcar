package loveduong.duongcute.service.impl;

import loveduong.duongcute.dto.request.OrderRequest;
import loveduong.duongcute.dto.response.MomoResponeStatus;
import loveduong.duongcute.dto.response.MomoResponse;
import loveduong.duongcute.dto.response.MomoResultResponse;
import loveduong.duongcute.service.MomoService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
@Service
public class MomoServiceImpl implements MomoService {
    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final String PARTNER_CODE = "MOMO";
    private static final String ACCESS_KEY = "F8BBA842ECF85";
    private static final String SECRET_KEY = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    private static final String REDIRECT_URL = "http://localhost:8080/booking";
    private static final String IPN_URL = "http://localhost:8080/booking/result";
    private static final String REQUEST_TYPE = "payWithMethod";
    @Override
    public MomoResponse createPaymentRequest(OrderRequest orderRequest) {
        String requestId= UUID.randomUUID().toString();
        String orderId=requestId;
        String orderInfo="Test";
        String extra=orderRequest.getId()+"&"+orderRequest.getCodeDiscount();
        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                ACCESS_KEY, orderRequest.getTotalPrice().longValue() , extra, IPN_URL, orderId, orderInfo, PARTNER_CODE, REDIRECT_URL,
                requestId, REQUEST_TYPE);
        String signature;
        try {
            signature=signHmacSHA256(rawSignature);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        Map<String,Object> requestBody= new HashMap<>();
        requestBody.put("partnerCode",PARTNER_CODE);
        requestBody.put("requestId",requestId);
        requestBody.put("amount",orderRequest.getTotalPrice());
        requestBody.put("orderId",orderId);
        requestBody.put("orderInfo",orderInfo);
        requestBody.put("orderExpireTime",10);
        requestBody.put("redirectUrl",REDIRECT_URL);
        requestBody.put("ipnUrl",IPN_URL);
        requestBody.put("requestType",REQUEST_TYPE);
        requestBody.put("extraData",extra);
        requestBody.put("lang","vi");
        requestBody.put("signature",signature);
        RestClient restClient= RestClient.builder().baseUrl("https://test-payment.momo.vn/v2/gateway/api/create")
                .defaultHeader("Content-Type","application/json; charset=UTF-8")
                .build();

        return restClient.post().body(requestBody).retrieve().body(MomoResponse.class);
    }


    private static String signHmacSHA256(String data) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKey);
        byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1)
                hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
    @Override
    public MomoResponeStatus confirmPayment(String orderId) {
        String requestId= UUID.randomUUID().toString();
        String rawSignature = String.format(
                "accessKey=%s&orderId=%s&partnerCode=%s&requestId=%s",
                ACCESS_KEY, orderId, PARTNER_CODE, requestId);
        String signature;
        try {
            signature=signHmacSHA256(rawSignature);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        Map<String,Object> requestBody= new HashMap<>();
        requestBody.put("partnerCode",PARTNER_CODE);
        requestBody.put("orderId",orderId);
        requestBody.put("requestId",requestId);
        requestBody.put("lang","vi");
        requestBody.put("signature",signature);
        RestClient restClient= RestClient.builder().baseUrl("https://test-payment.momo.vn/v2/gateway/api/query")
                .defaultHeader("Content-Type","application/json; charset=UTF-8")
                .build();

        return restClient.post().body(requestBody).retrieve().body(MomoResponeStatus.class);
    }
    public void handleResultPaymentForMomo(MomoResultResponse momoResultResponse){
        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&message=%s&orderId=%s&orderInfo=%s&orderType=%s&partnerCode=%s&payType=%s&requestId=%s&responseTime=%s&resultCode=%s&transId=%s",
                ACCESS_KEY,
                momoResultResponse.getAmount(),
                (momoResultResponse.getExtraData() == null ? "" : momoResultResponse.getExtraData()), // Xử lý null
                momoResultResponse.getMessage(),
                momoResultResponse.getOrderId(),
                momoResultResponse.getOrderInfo(),
                momoResultResponse.getOrderType(),
                momoResultResponse.getPartnerCode(),
                momoResultResponse.getPayType(),
                momoResultResponse.getRequestId(),
                momoResultResponse.getResponseTime(),
                momoResultResponse.getResultCode(),
                momoResultResponse.getTransId()
        );
        String signature;
        try {
            signature=signHmacSHA256(rawSignature);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (signature.equals(momoResultResponse.getSignature())) {
            System.out.println("✅ Chữ ký hợp lệ. Check tiếp resultCode...");
            if (momoResultResponse.getResultCode() == 0) {
            }
        } else {
            System.out.println("❌ Chữ ký SAI. Có thể là giả mạo!");
        }
    }
}
