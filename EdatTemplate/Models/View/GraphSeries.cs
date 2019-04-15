using System.Collections.Generic;

namespace EdatTemplate.Models.View
{
    public class GraphSeries
    {
        public string Name { get; set; }
        public IEnumerable<GraphDataPoint> Series { get; set; }
    }
}