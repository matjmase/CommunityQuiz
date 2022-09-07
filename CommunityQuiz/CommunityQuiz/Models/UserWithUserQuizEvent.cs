using CommunityQuiz.Db;

namespace CommunityQuiz.Models
{
    public class UserWithUserQuizEvent
    {
        public ClientUser User { get; set; }   
        public ICollection<UserQuizEvent> QuizEvents { get; set; } = new HashSet<UserQuizEvent>();
    }
}
