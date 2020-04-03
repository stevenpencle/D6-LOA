using d6loa.Models.Arculus;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace d6loa.Services
{
    public interface IStaffService
    {
        Task<IEnumerable<Staff>> GetStaffByNameAsync(string name);
        Task<Staff> GetByIdAsync(int id);
        Task<Staff> GetByEmailAsync(string email);
        Task<Staff> GetByAzureAdOidAsync(string azureAdOid);
    }
}
