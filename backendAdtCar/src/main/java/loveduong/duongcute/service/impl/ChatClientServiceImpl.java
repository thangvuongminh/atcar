package loveduong.duongcute.service.impl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import loveduong.duongcute.dto.response.ResponseChatClientForUser;
import loveduong.duongcute.service.ChatClientService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

import  static   org.springframework.ai.chat.memory.ChatMemory.CONVERSATION_ID;
@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatClientServiceImpl implements ChatClientService {
    ChatClient chatClient;
    ChatClient chatClientForUser;
    RetrievalAugmentationAdvisor retrievalAugmentationAdvisor;
    @Value("classpath:/prompt/promptTemplateForUser")
    Resource userPrompt;
    ChatClientServiceImpl(@Qualifier("webSearchChatClient") ChatClient chatClient,ChatClient chatClientForUser,RetrievalAugmentationAdvisor retrievalAugmentationAdvisor){
        this.chatClient=chatClient;
        this.chatClientForUser=chatClientForUser;
        this.retrievalAugmentationAdvisor=retrievalAugmentationAdvisor;
    }
    public String chatClientEditor(String message){
        SecurityContext securityContext= SecurityContextHolder.getContext();
        Authentication authentication=securityContext.getAuthentication();
        return chatClient.prompt().advisors(advisorSpec -> advisorSpec.param(CONVERSATION_ID,authentication.getName())).user(message).call().content();
    }

    public List<ResponseChatClientForUser> chatClientUser(String message){
        SecurityContext securityContext= SecurityContextHolder.getContext();
        Authentication authentication=securityContext.getAuthentication();
        return chatClientForUser.prompt().system(s->s.text(userPrompt)).advisors(a -> {
            a.advisors(retrievalAugmentationAdvisor);
            a.param(CONVERSATION_ID,authentication.getName());
        }).user(message).call().entity(new ParameterizedTypeReference<List<ResponseChatClientForUser>>() {});
    }
}
