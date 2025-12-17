    package loveduong.duongcute.configuration;

    import com.nimbusds.jose.jwk.source.ImmutableSecret;
    import com.nimbusds.jose.util.Base64;
    import loveduong.duongcute.security.SecurityUtils;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.context.annotation.Lazy;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.AuthenticationProvider;
    import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
    import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.core.userdetails.UserDetailsService;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.oauth2.jwt.JwtDecoder;
    import org.springframework.security.oauth2.jwt.JwtEncoder;
    import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
    import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
    import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
    import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
    import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
    import org.springframework.security.web.SecurityFilterChain;

    import javax.crypto.SecretKey;
    import javax.crypto.spec.SecretKeySpec;

    import static org.springframework.security.config.Customizer.withDefaults;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {
        RestAuthEntryPoint restAuthEntryPoint;
        UserDetailsService userDetailsService;
        RedisFilterConfiguration redisFilterConfiguration;
        String[] listPermit={"post/all","/category/all","marketing/**","product/home","product/**","/v3/api-docs/**","/swagger-ui/**","/swagger-ui.html","/login","/refresh","/register","/forget-password","/new-password","storage/**"};
        @Value("${maintenance.security.authentication.jwt.base64-secret}")
         String jwtKey;
        SecurityConfig(UserDetailsService userDetailsService,RestAuthEntryPoint restAuthEntryPoint,@Lazy RedisFilterConfiguration redisFilterConfiguration){
            this.restAuthEntryPoint=restAuthEntryPoint;
            this.userDetailsService=userDetailsService;
            this.redisFilterConfiguration=redisFilterConfiguration;
        }
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                    .cors(withDefaults())
                    .csrf(AbstractHttpConfigurer::disable)
                        .authorizeHttpRequests((authorize) -> authorize.requestMatchers(listPermit).permitAll()
                                .requestMatchers("/users/profile").hasRole("VIEW_USER")
                                .requestMatchers("upload/document").hasRole("UPLOAD_DOCUMENT")
                                .requestMatchers("admin/**").hasRole("VIEW_ALL_USER")
                                .requestMatchers("upload/post").hasRole("CREATE_POST")
                                .requestMatchers("user/chat").hasRole("USER_CHAT")
                                .requestMatchers("super/user/chat").hasRole("EDITOR_CHAT")
                                .requestMatchers("admin/product/create").hasRole("CREATE_PRODUCT")

                            .anyRequest().authenticated()
                    )
                    .logout((logout)     -> logout.logoutUrl("logout"))

             .sessionManagement(sees -> sees.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authenticationProvider(authenticationProvider())
                    .addFilterAfter(redisFilterConfiguration, BearerTokenAuthenticationFilter.class)
                    .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())).authenticationEntryPoint(restAuthEntryPoint));
            return http.build();
        }
        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
        @Bean
        public AuthenticationProvider authenticationProvider() {
            DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
            provider.setUserDetailsService(userDetailsService);
            provider.setPasswordEncoder(passwordEncoder());
            return provider;
        }
        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
            return config.getAuthenticationManager();
        }
        @Bean
        public JwtEncoder jwtEncoder() {
            return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
        }
         SecretKey getSecretKey() {
            byte[] keyBytes = Base64.from(jwtKey).decode();
            return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityUtils.JWT_ALGORITHM.getName());
        }

        @Bean
        public JwtAuthenticationConverter jwtAuthenticationConverter() {
            JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
            grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
            grantedAuthoritiesConverter.setAuthoritiesClaimName("role");
            JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
            jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
            return jwtAuthenticationConverter;
        }

        @Bean
        public JwtDecoder jwtDecoder() {
            NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSecretKey()).macAlgorithm(SecurityUtils.JWT_ALGORITHM).build();
            return token -> {
                try {
                    return jwtDecoder.decode(token);
                } catch (Exception e) {
                    throw e;
                }
            };
        }

    }
