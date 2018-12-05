﻿using EdatTemplate.Models.Domain;
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
        private EntityFrameworkConfig _entityFrameworkConfig;
        private DiagnosticListener _listener;

        public EntityContext(IHostingEnvironment environment, EntityFrameworkConfig entityFrameworkConfig)
        {
            Initialize(environment, entityFrameworkConfig);
        }

        public EntityContext(IHostingEnvironment environment, EntityFrameworkConfig entityFrameworkConfig, DbContextOptions options) : base(options)
        {
            Initialize(environment, entityFrameworkConfig);
        }

        private void Initialize(IHostingEnvironment environment, EntityFrameworkConfig entityFrameworkConfig)
        {
            _environment = environment;
            _entityFrameworkConfig = entityFrameworkConfig;
            ConfigureLogging();
        }

        public override void Dispose()
        {
            _listener?.Dispose();
            base.Dispose();
        }

        private void ConfigureLogging()
        {
            if (!_environment.IsDevelopment()) return;
            _listener = (DiagnosticListener)this.GetService<DiagnosticSource>();
            _listener.SubscribeWithAdapter(new NLogSqlInterceptor(_entityFrameworkConfig));
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
        }
    }
}

