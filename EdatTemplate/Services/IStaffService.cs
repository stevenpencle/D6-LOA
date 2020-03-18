using EdatTemplate.Models.Arculus;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdatTemplate.Services
{
    public interface IStaffService
    {
        Task<IEnumerable<Staff>> GetStaffByNameAsync(string name);
        Task<Staff> GetByIdAsync(int id);
        Task<Staff> GetByEmailAsync(string email);
    }
}