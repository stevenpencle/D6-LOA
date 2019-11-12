using EdatTemplate.Models.Domain;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Reflection;

namespace EdatTemplate.ORM
{
    public static class ModelBuilderExtensions
    {
        public static void ShadowProperties(this ModelBuilder modelBuilder)
        {
            foreach (var tp in modelBuilder.Model.GetEntityTypes())
            {
                var t = tp.ClrType;
                if (!typeof(IAuditedEntity).IsAssignableFrom(t)) continue;
                var method = SetAuditingShadowPropertiesMethodInfo.MakeGenericMethod(t);
                method.Invoke(modelBuilder, new object[] { modelBuilder });
            }
        }

        private static readonly MethodInfo SetAuditingShadowPropertiesMethodInfo = typeof(ModelBuilderExtensions)
        .GetMethods(BindingFlags.Public | BindingFlags.Static)
        .Single(t => t.IsGenericMethod && t.Name == "SetAuditingShadowProperties");


        public static void SetAuditingShadowProperties<T>(ModelBuilder builder) where T : class, IAuditedEntity
        {
            builder.Entity<T>().Property(x => x.LastUpdated).IsRequired();
            builder.Entity<T>().Property(x => x.LastUpdatedAppUserId).IsRequired();
        }
    }
}

