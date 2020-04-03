namespace d6loa.ORM
{
    public class EntityFrameworkConfig
    {
        public bool InitializeDatabase { get; set; }
        public bool DeduplicateLoggedCommands { get; set; }
        public bool UseDocker { get; set; }
    }
}
