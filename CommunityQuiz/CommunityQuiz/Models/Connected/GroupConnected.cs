using CommunityQuiz.Db;

namespace CommunityQuiz.Models.Connected
{
    public class GroupConnected
    {
        public Group Group { get; set; }

        public ICollection<UserConnected> Users { get; set; } = new HashSet<UserConnected>();
        public ICollection<QuizConnected> Quizzes { get; set; } = new HashSet<QuizConnected>();
        public ICollection<UserQuizEventConnected> QuizzEvents { get; set; } = new HashSet<UserQuizEventConnected>();
    }
}
