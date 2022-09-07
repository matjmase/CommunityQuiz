using CommunityQuiz.Models.Connected;

namespace CommunityQuiz.Models
{
    public class UserWithQuiz
    {
        public ClientUser User { get; set; }
        public QuizConnected Quiz { get; set; }
    }
}
