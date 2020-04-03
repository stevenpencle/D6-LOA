namespace d6loa.Security
{
    public class ApplicationClaims
    {
        //application specific claims
        public const string AuthenticationTypeClaim = "d6loa_AUTH_TYPE";
        public const string UserSid = "d6loa_USER_SID";
        public const string NameClaim = "d6loa_NAME";
        public const string RoleClaim = "d6loa_ROLE";
        public static string UserId = "d6loa_USER_ID";
        public static string StaffId = "d6loa_STAFF_ID";
        public static string AppUserId = "d6loa_APP_USER_ID";
    }
}
