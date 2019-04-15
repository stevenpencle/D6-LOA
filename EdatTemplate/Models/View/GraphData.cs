using System.Collections.Generic;

namespace EdatTemplate.Models.View
{
    public class GraphData
    {
        public string Title { get; set; }
        public IEnumerable<GraphSeries> SeriesData { get; set; }
    }
}