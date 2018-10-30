using EdatTemplate.Models.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdatTemplate.Services
{
    public interface IStaffService
    {
        Task<IEnumerable<Staff>> GetStaffByName(string name);
        Task<Staff> GetById(int id);
        Task<Staff> GetByEmail(string email);
    }
}