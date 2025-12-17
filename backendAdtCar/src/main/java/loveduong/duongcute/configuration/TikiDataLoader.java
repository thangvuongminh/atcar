package loveduong.duongcute.configuration;

import jakarta.annotation.PostConstruct;
import org.springframework.ai.document.Document;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TikiDataLoader {
    @Value("classpath:/rules/chinh_sach_sua_chua_o_to_full.pdf")
    Resource infoCompany;
    private VectorStore vectorStore;
    TikiDataLoader(VectorStore vectorStore){
        this.vectorStore=vectorStore;
    }
    @PostConstruct
    public void loadData(){
        TikaDocumentReader tikaDocumentReader=new TikaDocumentReader(infoCompany);
        List<Document> docs=tikaDocumentReader.get();

        TokenTextSplitter tokenTextSplitter= TokenTextSplitter.builder().withChunkSize(300).withMaxNumChunks(600).build();
        vectorStore.add(tokenTextSplitter.split(docs));
    }
    @Bean
    RetrievalAugmentationAdvisor retrievalAugmentationAdvisor(VectorStore vectorStore){
        return  RetrievalAugmentationAdvisor.builder().documentRetriever(
                VectorStoreDocumentRetriever.builder().vectorStore(vectorStore).similarityThreshold(0.6).topK(4).build()).build();
    }
}
