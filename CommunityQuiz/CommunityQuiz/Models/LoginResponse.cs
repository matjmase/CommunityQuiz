namespace CommunityQuiz.Models
{
    public class LoginResponse
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string[] Roles { get; set; }
        public string Token { get; set; }
        public DateTime ValidUntil { get; set; }
    }
}
