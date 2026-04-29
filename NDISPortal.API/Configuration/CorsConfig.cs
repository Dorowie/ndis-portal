namespace NDISPortal.API.Configuration
{
    public static class CorsConfig
    {
        public const string AllowAngularDev = "AllowAngularDev";

        public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(AllowAngularDev, policy =>
                {
                    policy.WithOrigins(
                            "http://localhost:4200",  // Default Angular port
                            "http://localhost:5200",  // Alternative Angular port
                            "https://localhost:4200",
                            "https://localhost:5200",
                            "https://localhost:7113",   // API HTTPS port
                            "http://localhost:5130"   // API HTTP port
                        )
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });

            return services;
        }

        public static IApplicationBuilder UseCorsConfiguration(this IApplicationBuilder app)
        {
            app.UseCors(AllowAngularDev);
            return app;
        }
    }
}