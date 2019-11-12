namespace EdatTemplate.Security
{
    public class ApplicationClaims
    {
        //application specific claims
        public const string AuthenticationTypeClaim = "EDATTEMPLATE_AUTH_TYPE";
        public const string UserSid = "EDATTEMPLATE_USER_SID";
        public const string NameClaim = "EDATTEMPLATE_NAME";
        public const string RoleClaim = "EDATTEMPLATE_ROLE";
        public static string UserId = "EDATTEMPLATE_USER_ID";
        public static string StaffId = "EDATTEMPLATE_STAFF_ID";
        public static string AppUserId = "EDATTEMPLATE_APP_USER_ID";
    }
}