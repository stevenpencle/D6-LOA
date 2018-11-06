using EdatTemplate.Models.Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Diagnostics;
using System.Linq;

namespace EdatTemplate.ORM
{
    public class EntityContext : DbContext
    {
        public EntityContext()
        {
            ConfigureLogging();
        }

        public EntityContext(DbContextOptions options) : base(options)
        {
            ConfigureLogging();
        }
        
        private void ConfigureLogging()
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var isDevelopment = environment == EnvironmentName.Development;
            if (!isDevelopment) return;
            var listener = this.GetService<DiagnosticSource>();
            (listener as DiagnosticListener).SubscribeWithAdapter(new NLogSqlInterceptor());
        }

        public virtual DbSet<Sample> Samples { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //reflectivly apply UTC date converter to all dates to make sure all dates are stored in SQL Server as UTC
            foreach (var pb in modelBuilder.Model
                .GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(DateTime))
                .Select(p => modelBuilder.Entity(p.DeclaringEntityType.ClrType).Property(p.Name)))
            {
                pb.HasConversion(new ValueConverter<DateTime, DateTime>(
                    v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                ));
            }
            foreach (var pb in modelBuilder.Model
                .GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(DateTime?))
                .Select(p => modelBuilder.Entity(p.DeclaringEntityType.ClrType).Property(p.Name)))
            {
                pb.HasConversion(new ValueConverter<DateTime?, DateTime?>(
                    v => !v.HasValue
                        ? v
                        : v.Value.Kind == DateTimeKind.Utc
                            ? v
                            : v.Value.ToUniversalTime(),
                    v => !v.HasValue
                        ? v
                        : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc)
                ));
            }
            // add any additional constraints
            modelBuilder.Entity<Sample>().HasIndex(e => e.Name).IsUnique().HasName("IX_Sample_Name");

            // cascade delete configuration example
            //modelBuilder.Entity<Parent>()
            //    .HasMany(p => p.Children)
            //    .WithRequired()
            //    .WillCascadeOnDelete();

        }
    }
}

