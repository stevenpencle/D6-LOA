﻿using System.Collections.Generic;

namespace EdatTemplate.Infrastructure
{
    public class SendGridConfig
    {
        public string ClientSecret { get; set; }
        public string DoNotReplyEmailAddress { get; set; }
        public IEnumerable<string> OverrideToEmailAddresses { get; set; }
        public string DeveloperEmailAddressClaim { get; set; }
        public bool Enabled { get; set; }
    }
}