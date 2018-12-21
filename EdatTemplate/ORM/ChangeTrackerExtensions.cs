using EdatTemplate.Models.Domain;
using EdatTemplate.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Security.Claims;

namespace EdatTemplate.ORM
{
    public static class ChangeTrackerExtensions
    {
        public static void SetShadowProperties(this ChangeTracker changeTracker, IHttpContextAccessor httpContextAccessor)
        {
            changeTracker.DetectChanges();
            var timestamp = DateTime.UtcNow;
            var userName = httpContextAccessor.HttpContext == null
                ? "SYSTEM"
                : httpContextAccessor.HttpContext.User.Identity.Name;
            var staffClaim = ((ClaimsIdentity) httpContextAccessor.HttpContext?.User.Identity)?.FindFirst(ApplicationClaims.StaffId);
            foreach (var entry in changeTracker.Entries())
            {
                if (!(entry.Entity is IAuditedEntity entity)) continue;
                if (entry.State != EntityState.Added && entry.State != EntityState.Modified) continue;
                entity.LastUpdated = timestamp;
                entity.LastUpdatedBy = userName;
                entity.LastUpdatedByStaffId = staffClaim == null ? 0 : int.Parse(staffClaim.Value);
            }
        }
    }
}

