using System;
using System.Collections.Generic;

namespace d6loa.Models.Arculus
{
    public class Staff
    {
        public int Id { get; set; }
        public string RacfId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool? Active { get; set; }
        public string StaffTypeCode { get; set; }
        public DateTime? StatusTimestamp { get; set; }
        public string MiddleName { get; set; }
        public DateTime? BeginDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string District { get; set; }
        public string PeopleFirstId { get; set; }
        public string ConsultantId { get; set; }
        public string AceaId { get; set; }
        public string PositionTypeCode { get; set; }
        public string PositionNumber { get; set; }
        public string EmailAddress { get; set; }
        public string Signature { get; set; }
        public string Phone { get; set; }
        public string PhoneExtension { get; set; }
        public string Fax { get; set; }
        public string Building { get; set; }
        public string Office { get; set; }
        public string Room { get; set; }
        public string MailStation { get; set; }
        public string LastUpdateUserId { get; set; }
        public DateTime? LastUpdateTimestamp { get; set; }
        public string PositionWorkTitle { get; set; }
        public string OrganizationalCode { get; set; }
        public string ClsfFamily { get; set; }
        public string ClsfGroup { get; set; }
        public string ClsfOccupation { get; set; }
        public int? ManagerId { get; set; }
        public string AzureAdOid { get; set; }
        public IEnumerable<string> ActiveDirectoryDomains { get; set; }
        public IEnumerable<StaffConnector> StaffConnectors { get; set; }
    }
}
