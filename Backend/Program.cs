using System;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            IHost host = CreateHostBuilder(args).Build();
            using IServiceScope scope = host.Services.CreateScope();
            StoreContext context = scope.ServiceProvider.GetRequiredService<StoreContext>();
            UserManager<User> userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            ILogger<Program> logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            try {
                await context.Database.MigrateAsync();
                await DbInitializer.Initialize(context, userManager);
            } catch(Exception e) {
                logger.LogError(e, "Problem migrating data.");
            }

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
