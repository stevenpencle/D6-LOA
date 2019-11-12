using EdatTemplate.Models.Domain;
using EdatTemplate.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Linq;
using System.Security.Claims;

namespace EdatTemplate.ORM
{
    public static class ChangeTrackerExtensions
    {
        public static void SetShadowProperties(this ChangeTracker changeTracker, IHttpContextAccessor httpContextAccessor)
        {
            changeTracker.DetectChanges();
            var timestamp = DateTime.UtcNow;
            var appUserIdClaim = ((ClaimsIdentity)httpContextAccessor.HttpContext?.User.Identity)?.FindFirst(ApplicationClaims.AppUserId);
            foreach (var entry in changeTracker.Entries())
            {
                if (!(entry.Entity is IAuditedEntity entity)) continue;
                if (entry.State != EntityState.Added && entry.State != EntityState.Modified) continue;
                entity.LastUpdated = timestamp;
                if (appUserIdClaim == null)
                {
                    var sysUser = ((EntityContext)changeTracker.Context).FdotAppUsers.Where(x => x.SrsId == 0).Single();
                    entity.LastUpdatedAppUserId = sysUser.Id;
                }
                else
                {
                    entity.LastUpdatedAppUserId = int.Parse(appUserIdClaim.Value);
                }
            }
        }
    }
}

