using System;

namespace EdatTemplate.Models.Domain
{
    public interface IAuditedEntity
    {
        DateTime LastUpdated { get; set; }
        int LastUpdatedAppUserId { get; set; }
        AppUser LastUpdatedAppUser { get; set; }
    }
}