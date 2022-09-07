using CommunityQuiz.Db;

namespace CommunityQuiz.Models
{
    public class RegisterCredentials : LoginCredentials
    {
        public string UserName { get; set; }
        public string[] Roles { get; set; }

        public User ToDbUser()
        {
            return new User()
            {
                Email = Email,
                UserName = UserName,
            };
        }
    }
}
