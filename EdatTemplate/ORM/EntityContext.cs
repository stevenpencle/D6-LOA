using EdatTemplate.Models.Domain;
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;

namespace EdatTemplate.ORM
{
    public class EntityContext : DbContext
    {
        public EntityContext() { }
        public EntityContext(DbContextOptions options) : base(options) { }

        public virtual DbSet<Sample> Samples { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Sample>().HasIndex(e => e.Name).IsUnique().HasName("IX_Sample_Name");
            
            // cascade delete configuration example
            //modelBuilder.Entity<Parent>()
            //    .HasMany(p => p.Children)
            //    .WithRequired()
            //    .WillCascadeOnDelete();

        }
    }
}