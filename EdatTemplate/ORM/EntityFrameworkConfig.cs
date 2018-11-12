namespace EdatTemplate.ORM
{
    public class EntityFrameworkConfig
    {
        public bool InitializeDatabase { get; set; }
        public bool DeduplicateLoggedCommands { get; set; }
        public bool UseDocker { get; set; }
        public bool UseSqlite { get; set; }
    }
}