using CommunityQuiz.Db;

namespace CommunityQuiz.Models.Connected
{
    public class QuizConnected
    {
        public Quiz Quiz { get; set; }

        public ICollection<UserQuizEventConnected> QuizzEvents { get; set; } = new HashSet<UserQuizEventConnected>();
        public ICollection<QuestionConnected> Questions { get; set; } = new HashSet<QuestionConnected>();
    }
}
