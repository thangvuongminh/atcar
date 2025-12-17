package loveduong.duongcute.configuration;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.client.RestClient;

@Configuration
public class ChatClientConfiguration {
    @Bean
    public  ChatMemory jdbcChatMemory(JdbcChatMemoryRepository jdbcChatMemoryRepository ){
        return MessageWindowChatMemory.builder().chatMemoryRepository(jdbcChatMemoryRepository).maxMessages(5).build();
    }
    @Bean
    @Primary
    public ChatClient chatClient(ChatModel chatModel, ChatMemory chatMemory){
        return  ChatClient.builder(chatModel).defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build()).build();
    }
    @Bean("webSearchChatClient")
    public ChatClient chatClientSearch(ChatModel chatModel, ChatMemory chatMemory, RestClient.Builder restClientBuilder){
        var webSearch= RetrievalAugmentationAdvisor.builder().documentRetriever(
                WebSearchRetrieveConfiguration.builder().maxResults(5).restClientBuilder(restClientBuilder).build()
        ).build();
        return  ChatClient.builder(chatModel).defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build(),webSearch).build();
    }
}
