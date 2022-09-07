using CommunityQuiz.Db;

namespace CommunityQuiz.Models.Connected
{
    public class QuestionConnected
    {
        public Question Question { get; set; }
        public ICollection<AnswerConnected> Answers { get; set; } = new HashSet<AnswerConnected>();
    }
}
