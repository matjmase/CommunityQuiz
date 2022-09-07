using CommunityQuiz.Db;

namespace CommunityQuiz.Models.Connected
{
    public class UserConnected
    {
        public ClientUser User { get; set; }
        public ICollection<GroupConnected> Groups { get; set; } = new HashSet<GroupConnected>();
    }
}
