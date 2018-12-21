using System;

namespace EdatTemplate.Models.Domain
{
    public interface IAuditedEntity
    {
        DateTime LastUpdated { get; set; }
        int LastUpdatedByStaffId { get; set; }
        string LastUpdatedBy { get; set; }
    }
}