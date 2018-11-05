using EdatTemplate.Models.Domain;
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using JetBrains.Annotations;
using System.Linq.Expressions;
using System.Linq;

namespace EdatTemplate.ORM
{
    public class EntityContext : DbContext
    {
        public EntityContext() { }
        public EntityContext(DbContextOptions options) : base(options) { }

        //Convert any non-UTC datetimes to UTC before serialization to SQL Server
        //Specify the datetime kind as UTC after object materialization from SQL Server
        private ValueConverter<DateTime, DateTime> _utcDateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

        private ValueConverter<DateTime?, DateTime?> _utcNullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
                v => !v.HasValue
                    ? v
                    : v.Value.Kind == DateTimeKind.Utc
                        ? v
                        : v.Value.ToUniversalTime(),
                v => !v.HasValue
                    ? v
                    : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc)
            );

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
                pb.HasConversion(_utcDateTimeConverter);
            }
            foreach (var pb in modelBuilder.Model
                .GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(DateTime?))
                .Select(p => modelBuilder.Entity(p.DeclaringEntityType.ClrType).Property(p.Name)))
            {
                pb.HasConversion(_utcNullableDateTimeConverter);
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