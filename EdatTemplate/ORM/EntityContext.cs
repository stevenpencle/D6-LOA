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
        private IHostingEnvironment _environment;
        public EntityContext(IHostingEnvironment environment)
        {
            Initialize(environment);
        }

        public EntityContext(IHostingEnvironment environment, DbContextOptions options) : base(options)
        {
            Initialize(environment);
        }

        private void Initialize(IHostingEnvironment environment)
        {
            _environment = environment;
            ConfigureLogging();
        }

        private void ConfigureLogging()
        {
            if (!_environment.IsDevelopment()) return;
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

