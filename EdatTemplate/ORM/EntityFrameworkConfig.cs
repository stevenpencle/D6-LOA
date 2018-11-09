namespace EdatTemplate.ORM
{
    public class EntityFrameworkConfig
    {
        public bool InitializeDatabase { get; set; }
        public bool DeduplicateLoggedCommands { get; set; }
    }
}