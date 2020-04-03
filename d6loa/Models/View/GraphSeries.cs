using System.Collections.Generic;

namespace d6loa.Models.View
{
    public class GraphSeries
    {
        public string Name { get; set; }
        public IEnumerable<GraphDataPoint> Series { get; set; }
    }
}
