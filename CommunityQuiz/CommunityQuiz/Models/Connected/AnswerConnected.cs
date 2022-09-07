using CommunityQuiz.Db;

namespace CommunityQuiz.Models.Connected
{
    public class AnswerConnected
    {
        public Answer Answer { get; set; }
        public ICollection<AnswerEventConnected> AnswerEvents { get; set; } = new HashSet<AnswerEventConnected>();
    }
}
