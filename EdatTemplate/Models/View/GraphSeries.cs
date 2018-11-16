using System.Collections.Generic;

namespace EdatTemplate.Models.View
{
    public class GraphSeries
    {
        public string Label { get; set; }
        public IEnumerable<GraphDataPoint> DataPoints { get; set; }
    }
}