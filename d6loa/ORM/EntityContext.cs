using d6loa.Models.Domain;
using d6loa.Models.Domain.Enums;
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

namespace d6loa.ORM
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
        public virtual DbSet<Contract> Contracts { get; set; }
        public virtual DbSet<Loa> Loas { get; set; }
        public virtual DbSet<Vendor> Vendors { get; set; }
        public virtual DbSet<Invoice> Invoices { get; set; }
        public virtual DbSet<Supplement> Supplements { get; set; }

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
            ChangeTracker.LazyLoadingEnabled = false;
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
            modelBuilder.Entity<AppUser>()
                        .HasMany(x => x.LastUpdatedContracts)
                        .WithOne(x => x.LastUpdatedAppUser)
                        .HasForeignKey(x => x.LastUpdatedAppUserId)
                        .IsRequired()
                        .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<AppUser>()
                        .HasMany(x => x.LastUpdatedVendors)
                        .WithOne(x => x.LastUpdatedAppUser)
                        .HasForeignKey(x => x.LastUpdatedAppUserId)
                        .IsRequired()
                        .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<AppUser>()
                        .HasMany(x => x.LastUpdatedInvoices)
                        .WithOne(x => x.LastUpdatedAppUser)
                        .HasForeignKey(x => x.LastUpdatedAppUserId)
                        .IsRequired()
                        .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<AppUser>()
                        .HasMany(x => x.LastUpdatedLoas)
                        .WithOne(x => x.LastUpdatedAppUser)
                        .HasForeignKey(x => x.LastUpdatedAppUserId)
                        .IsRequired()
                        .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<AppUser>()
                        .HasMany(x => x.LastUpdatedSupplements)
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

            // Vendor
            modelBuilder.Entity<Vendor>()
                        .ToTable("TBL_Vendor")
                        .HasKey(x => x.VendorId);
            modelBuilder.Entity<Vendor>()
                        .Property(x => x.VendorId)
                        .HasColumnName("VendorId");
            modelBuilder.Entity<Vendor>()
                        .Property(x => x.VendorFeid)
                        .HasColumnType("varchar(16)")
                        .IsRequired();
            modelBuilder.Entity<Vendor>()
                        .HasIndex(x => x.VendorFeid)
                        .IsUnique()
                        .HasName("IX_Vendor_VendorFeid");
            modelBuilder.Entity<Vendor>()
                        .Property(x => x.VendorCompany)
                        .HasColumnType("varchar(80)")
                        .IsRequired();
            modelBuilder.Entity<Vendor>()
                        .Property(x => x.VendorAddress1)
                        .HasColumnType("varchar(60)")
                        .IsRequired();
            modelBuilder.Entity<Vendor>()
                        .Property(x => x.VendorAddress2)
                        .HasColumnType("varchar(60)")
                        .IsRequired();
            modelBuilder.Entity<Vendor>()
                        .Property(x => x.VendorAddress3)
                        .HasColumnType("varchar(60)")
                        .IsRequired();
            modelBuilder.Entity<Vendor>()
                        .Property(x => x.VendorEmail)
                        .HasColumnType("varchar(60)")
                        .IsRequired();
            modelBuilder.Entity<Vendor>()
                        .Property(x => x.VendorPerson)
                        .HasColumnType("varchar(80)")
                        .IsRequired();
            modelBuilder.Entity<Vendor>()
                        .Property(x => x.VendorTelephone)
                        .HasColumnType("varchar(10)")
                        .IsRequired();
            modelBuilder.Entity<Vendor>()
                      .HasMany(x => x.Contracts)
                      .WithOne(x => x.CurrentVendor)
                      .HasForeignKey(x => x.VendorId)
                      .IsRequired()
                      .OnDelete(DeleteBehavior.Restrict);



            // Contract
            modelBuilder.Entity<Contract>()
                        .ToTable("TBL_Contract")
                        .HasKey(x => x.Id);
            modelBuilder.Entity<Contract>()
                        .Property(x => x.Id)
                        .HasColumnName("ContractId");
            modelBuilder.Entity<Contract>()
                        .Property(x => x.ContractNumber)
                        .HasColumnType("varchar(10)")
                        .IsRequired();
            modelBuilder.Entity<Contract>()
                        .HasIndex(x => x.ContractNumber)
                        .IsUnique()
                        .HasName("IX_Contract_ContractNumber");
            modelBuilder.Entity<Contract>()
                        .Property(x => x.FmNumber)
                        .HasColumnType("varchar(16)")
                        .IsRequired();
            modelBuilder.Entity<Contract>()
                        .Property(x => x.StartDate)
                        .IsRequired();
            modelBuilder.Entity<Contract>()
                        .Property(x => x.EndDate)
                       .IsRequired();
            modelBuilder.Entity<Contract>()
                        .Property(x => x.ExtDate)
                        .IsRequired();
            modelBuilder.Entity<Contract>()
                        .Property(x => x.OriginalContractAmt)
                        .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Contract>()
                        .Property(x => x.CurrentContractAmt)
                        .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Contract>()
                        .Property(x => x.ContractBalance)
                        .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Contract>()
                        .Property(x => x.DecommitBalance)
                        .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Contract>()
                        .Property(x => x.Comment)
                        .HasColumnType("varchar(2048)");
            // modelBuilder.Entity<Contract>()
            //           .HasMany(x => x.Supplements)
            //           .WithOne(x => x.CurrentContract)
            //           .HasForeignKey(x => x.ContractId)
            //           .IsRequired()
            //           .OnDelete(DeleteBehavior.Restrict);


            // Invoice
            modelBuilder.Entity<Invoice>()
                        .ToTable("TBL_Invoice")
                        .HasKey(x => x.Id);
            modelBuilder.Entity<Invoice>()
                        .Property(x => x.Id)
                        .HasColumnName("InvoiceId");
            modelBuilder.Entity<Invoice>()
                        .Property(x => x.ContractId)
                        .HasColumnType("int")
                        .IsRequired();
            modelBuilder.Entity<Invoice>()
                        .Property(x => x.LoaId)
                        .HasColumnType("int")
                        .IsRequired();
            modelBuilder.Entity<Invoice>()
                        .Property(x => x.InvoiceNumber)
                        .HasColumnType("int")
                        .IsRequired();
            modelBuilder.Entity<Invoice>()
                        .Property(x => x.InvoiceDate)
                        .IsRequired();
            modelBuilder.Entity<Invoice>()
                        .Property(x => x.InvoiceAmount)
                        .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Invoice>()
                        .Property(x => x.FinalInvoice)
                        .HasColumnType("bit");
            modelBuilder.Entity<Invoice>()
                        .Property(x => x.Comment)
                        .HasColumnType("varchar(2048)");

            // L.O.A.
            modelBuilder.Entity<Loa>()
                        .ToTable("TBL_Loa")
                        .HasKey(x => x.Id);
            modelBuilder.Entity<Loa>()
                        .Property(x => x.Id)
                        .HasColumnName("LoaId");
            modelBuilder.Entity<Loa>()
                        .Property(x => x.ContractId)
                        .HasColumnType("int")
                        .IsRequired();
            modelBuilder.Entity<Loa>()
                        .Property(x => x.LoaNumber)
                        .HasColumnType("int")
                        .IsRequired();
            modelBuilder.Entity<Loa>()
                       .HasIndex(e => new { e.ContractId, e.LoaNumber })
                       .IsUnique()
                       .HasName("IX_Loa_Contract");
            modelBuilder.Entity<Loa>()
                        .Property(x => x.StartDate)
                        .IsRequired();
            modelBuilder.Entity<Loa>()
                        .Property(x => x.EndDate)
                       .IsRequired();
            modelBuilder.Entity<Loa>()
                        .Property(x => x.ExtDate)
                        .IsRequired();
            modelBuilder.Entity<Loa>()
                        .Property(x => x.OriginalLoaAmt)
                        .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Loa>()
                        .Property(x => x.CurrentLoaAmt)
                        .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Loa>()
                        .Property(x => x.LoaBalance)
                        .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Loa>()
                        .Property(x => x.DecommitAmt)
                        .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Loa>()
                        .Property(x => x.Comment)
                        .HasColumnType("varchar(2048)");

            // Supplement
            modelBuilder.Entity<Supplement>()
                        .ToTable("TBL_Supplement")
                        .HasKey(x => x.Id);
            modelBuilder.Entity<Supplement>()
                        .Property(x => x.Id)
                        .HasColumnName("SupplementId");
            modelBuilder.Entity<Supplement>()
                        .Property(x => x.ContractId)
                        .HasColumnType("int")
                        .IsRequired();
            modelBuilder.Entity<Supplement>()
                        .Property(x => x.SupplementNumber)
                        .HasColumnType("int")
                        .IsRequired();
            modelBuilder.Entity<Supplement>()
                        .HasIndex(e => new { e.ContractId, e.SupplementNumber })
                        .IsUnique()
                        .HasName("IX_Supplement_Contract");
            modelBuilder.Entity<Supplement>()
                        .Property(x => x.StartDate)
                        .IsRequired();
            modelBuilder.Entity<Supplement>()
                        .Property(x => x.EndDate)
                        .IsRequired();
            modelBuilder.Entity<Supplement>()
                        .Property(x => x.SupplementAmount)
                        .HasColumnType("decimal(18,2)");

            //call base
            base.OnModelCreating(modelBuilder);
        }
    }
}
