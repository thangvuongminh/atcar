package loveduong.duongcute.util;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.logging.Filter;

@Getter
@Setter
@Builder(toBuilder = true)
public class SearchCriteria {
    private List<Filter> filters;
    @Getter
    @Setter
    @Builder(toBuilder = true)
    public static  class Filter {
        public enum QueryOperator {
            EQUALS,NOT_EQUALS,LIKE,LESS_THAN,GREATER_THAN
        }
        private String field;
        private QueryOperator operator;
        private String value;
    }
}
