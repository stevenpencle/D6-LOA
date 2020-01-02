using EdatTemplate.Models.Domain;
using EdatTemplate.Models.Domain.Enums;
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

        public virtual DbSet<AppUser> AppUsers { get; set; }
        public virtual DbSet<FdotAppUser> FdotAppUsers { get; set; }
        public virtual DbSet<PublicAppUser> PublicAppUsers { get; set; }
        public virtual DbSet<Sample> Samples { get; set; }
        public virtual DbSet<SampleMap> SampleMaps { get; set; }

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
            //reflectively apply UTC date converter to all dates to make sure all dates are stored in SQL Server as UTC
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
            // add entities
            // AppUser
            modelBuilder.Entity<AppUser>()
                        .ToTable("EDATTB0001_AppUser")
                        .HasKey(x => x.Id);
            modelBuilder.Entity<AppUser>()
                        .Property(x => x.Id)
                        .HasColumnName("AppUserId");
            modelBuilder.Entity<AppUser>()
                        .Property(x => x.Name)
                        .HasColumnType("varchar(100)");
            modelBuilder.Entity<AppUser>()
                        .Property(x => x.Email)
                        .HasColumnType("varchar(100)");
            modelBuilder.Entity<AppUser>()
                        .HasDiscriminator<AppUserType>(x => x.AppUserType)
                        .HasValue<FdotAppUser>(AppUserType.Fdot)
                        .HasValue<PublicAppUser>(AppUserType.Public);
            modelBuilder.Entity<AppUser>()
                        .HasMany(x => x.LastUpdatedSamples)
                        .WithOne(x => x.LastUpdatedAppUser)
                        .HasForeignKey(x => x.LastUpdatedAppUserId)
                        .IsRequired()
                        .OnDelete(DeleteBehavior.Restrict);
            // FdotAppUser
            modelBuilder.Entity<FdotAppUser>()
                        .Property(x => x.District)
                        .HasColumnType("varchar(2)");
            modelBuilder.Entity<FdotAppUser>()
                        .Property(x => x.RacfId)
                        .HasColumnType("varchar(10)");
            modelBuilder.Entity<FdotAppUser>()
                        .HasIndex(x => x.SrsId)
                        .IsUnique()
                        .HasName("IX_FdotAppUser_SrsId");
            modelBuilder.Entity<FdotAppUser>()
                        .HasMany(x => x.SampleAssignments)
                        .WithOne(x => x.AssignedFdotAppUser)
                        .HasForeignKey(x => x.AssignedFdotAppUserId)
                        .IsRequired()
                        .OnDelete(DeleteBehavior.Restrict);
            // PublicAppUser
            modelBuilder.Entity<PublicAppUser>()
                        .Property(x => x.Sid)
                        .HasColumnType("varchar(36)");
            modelBuilder.Entity<PublicAppUser>()
                        .HasIndex(x => x.Sid)
                        .IsUnique()
                        .HasName("IX_PublicAppUser_Sid");
            // Sample
            modelBuilder.Entity<Sample>()
                        .ToTable("EDATTB0002_Sample")
                        .HasKey(x => x.Id);
            modelBuilder.Entity<Sample>()
                        .Property(x => x.Id)
                        .HasColumnName("SampleId");
            modelBuilder.Entity<Sample>()
                        .Property(x => x.Name)
                        .HasColumnType("varchar(50)");
            modelBuilder.Entity<Sample>()
                        .HasIndex(e => e.Name)
                        .IsUnique()
                        .HasName("IX_Sample_Name");
            // SampleMap
            modelBuilder.Entity<SampleMap>()
                        .ToTable("EDATTB0003_SampleMap")
                        .HasKey(x => x.Id);
            modelBuilder.Entity<SampleMap>()
                        .Property(x => x.Id)
                        .HasColumnName("SampleMapId");
            modelBuilder.Entity<SampleMap>()
                        .Property(x => x.MapCoordinates)
                        .HasColumnType("varchar(8000)");
            //call base
            base.OnModelCreating(modelBuilder);
        }
    }
}
