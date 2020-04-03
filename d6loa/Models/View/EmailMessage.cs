using System.Collections.Generic;

namespace d6loa.Models.View
{
    public class EmailMessage
    {
        public EmailMessage()
        {
            Tos = new List<string>();
        }

        public IEnumerable<string> Tos { get; set; }

        public string From { get; set; }

        public string Body { get; set; }

        public string Subject { get; set; }

    }
}
