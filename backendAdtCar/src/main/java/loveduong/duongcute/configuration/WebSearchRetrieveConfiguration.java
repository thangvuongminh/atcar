package loveduong.duongcute.configuration;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import org.springframework.ai.document.Document;
import org.springframework.ai.rag.Query;
import org.springframework.ai.rag.retrieval.search.DocumentRetriever;
import org.springframework.http.HttpHeaders;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

public class WebSearchRetrieveConfiguration implements DocumentRetriever {
    private  String apiKey="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";
    private String baseUrl="https://api.tavily.com/search";
    private RestClient restClient;
    private   int resultLimit=5;
    WebSearchRetrieveConfiguration(RestClient.Builder restClientBuilder,int resultLimit){
        Assert.notNull(restClientBuilder,"restClient  can not be null");
        this.restClient=restClientBuilder.baseUrl(baseUrl).defaultHeader(HttpHeaders.AUTHORIZATION,
                "Bearer " + apiKey).build();
        if(resultLimit < 0){
            throw new IllegalArgumentException("Result must be greater than 0");
        }
        this.resultLimit=resultLimit;
    }
    public static Builder builder() {
        return new Builder();
    }
    @Override
    public List<Document> retrieve(Query query) {
        String q=query.text();
        TavilyResponsePayload response=restClient.post().body(new TavilyRequestPayload(q,"advanced",resultLimit)).retrieve().body(TavilyResponsePayload.class);
        if(response==null || CollectionUtils.isEmpty(response.results()))return  List.of();
        List<Document> documents=new ArrayList<>(response.results().size());
        for(TavilyResponsePayload.Hit hit   : response.results()){
            Document docs=Document.builder().metadata("title",hit.title()).metadata("url",hit.url())
                    .text(hit.content()).score(hit.score()).build();
            documents.add(docs);
        }
        return documents;
    }
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    private  record  TavilyRequestPayload(String query,String searchDepth,int maxResults){}
    private  record  TavilyResponsePayload(List<Hit> results){
        record Hit(String title,String  url,String content,double score){}
    }
    public static final class Builder {
        private RestClient.Builder restClientBuilderInstant;
        private   int resultLimit;

        public Builder() {

        }
        public Builder maxResults(int maxResults ) {
            resultLimit = maxResults;
            return this;
        }
        public Builder restClientBuilder( RestClient.Builder restClientBuilderInstant) {
            this.restClientBuilderInstant = restClientBuilderInstant;
            return this;
        }

        public WebSearchRetrieveConfiguration build() {
            return new WebSearchRetrieveConfiguration(restClientBuilderInstant,resultLimit);
        }
    }

}
