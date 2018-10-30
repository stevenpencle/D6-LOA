using EdatTemplate.Models.View;
using Microsoft.AspNetCore.Mvc;

namespace EdatTemplate.Controllers
{
    [Route("api/[controller]")]
    public class SiteController : Controller
    {
        private readonly EdatHeader _edatHeader;
        private readonly EdatFooter _edatFooter;
        
        public SiteController
            (
            EdatHeader edatHeader,
            EdatFooter edatFooter
            )
        {
            _edatHeader = edatHeader;
            _edatFooter = edatFooter;
        }

        [HttpGet("[action]")]
        public EdatHeader GetHeader()
        {
            return _edatHeader;
        }

        [HttpGet("[action]")]
        public EdatFooter GetFooter()
        {
            return _edatFooter;
        }
    }
}
