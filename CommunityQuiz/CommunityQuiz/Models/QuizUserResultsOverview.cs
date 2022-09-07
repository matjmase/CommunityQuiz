using CommunityQuiz.Db;

namespace CommunityQuiz.Models
{
    public class QuizUserResultsOverview
    {
        public Quiz Quiz { get; set; }
        public ICollection<UserWithUserQuizEvent> Users { get; set; } = new HashSet<UserWithUserQuizEvent>();
    }
}
