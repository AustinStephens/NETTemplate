using System;
using Backend.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            IHost host = CreateHostBuilder(args).Build();
            using IServiceScope scope = host.Services.CreateScope();
            StoreContext context = scope.ServiceProvider.GetRequiredService<StoreContext>();
            ILogger<Program> logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            try {
                context.Database.Migrate();
                DbInitializer.Initialize(context);
            } catch(Exception e) {
                logger.LogError(e, "Problem migrating data.");
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
