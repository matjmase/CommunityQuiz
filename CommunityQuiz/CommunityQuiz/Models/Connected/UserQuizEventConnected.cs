using CommunityQuiz.Db;

namespace CommunityQuiz.Models.Connected
{
    public class UserQuizEventConnected
    {
        public UserQuizEvent QuizzEvent { get; set; }
        public ICollection<AnswerEventConnected> AnswersEvents { get; set; } = new HashSet<AnswerEventConnected>(); 
    }
}
