using EdatTemplate.Models.Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Hosting;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EdatTemplate.ORM
{
    public class EntityContext : DbContext
    {
        private IWebHostEnvironment _environment;
        private IHttpContextAccessor _httpContextAccessor;
        private EntityFrameworkConfig _entityFrameworkConfig;
        private DiagnosticListener _listener;

        public virtual DbSet<Sample> Samples { get; set; }

        public EntityContext(IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor, EntityFrameworkConfig entityFrameworkConfig)
        {
            Initialize(environment, httpContextAccessor, entityFrameworkConfig);
        }

        public EntityContext(IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor, EntityFrameworkConfig entityFrameworkConfig, DbContextOptions options) : base(options)
        {
            Initialize(environment, httpContextAccessor, entityFrameworkConfig);
        }

        private void Initialize(IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor, EntityFrameworkConfig entityFrameworkConfig)
        {
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
            _entityFrameworkConfig = entityFrameworkConfig;
            ConfigureLogging();
        }

        private void ConfigureLogging()
        {
            if (!_environment.IsDevelopment()) return;
            _listener = (DiagnosticListener)this.GetService<DiagnosticSource>();
            _listener.SubscribeWithAdapter(new NLogSqlInterceptor(_entityFrameworkConfig));
        }

        public override void Dispose()
        {
            _listener?.Dispose();
            base.Dispose();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            ChangeTracker.SetShadowProperties(_httpContextAccessor);
            return await base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            ChangeTracker.SetShadowProperties(_httpContextAccessor);
            return base.SaveChanges();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //add boiler-plate behavior (audit properties and behavior)
            modelBuilder.ShadowProperties();
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
            //call base
            base.OnModelCreating(modelBuilder);
        }
    }
}

