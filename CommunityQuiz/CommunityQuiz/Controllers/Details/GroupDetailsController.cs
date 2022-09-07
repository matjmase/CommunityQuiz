using CommunityQuiz.Common.Extension;
using CommunityQuiz.Db;
using CommunityQuiz.Models.Connected;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers.Details
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupDetailsController : ControllerBase
    {
        private CommunityQuizContext _db;

        public GroupDetailsController(CommunityQuizContext db)
        {
            _db = db;
        }

        [HttpGet("all")]
        [Authorize]
        public IActionResult GetMyGroups()
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            var groups = _db.Users.Where(e => e.Id == user.Id)
                .Join
                (
                    _db.UserGroups,
                    u => u.Id,
                    ug => ug.UserId,
                    (u, ug) => ug
                )
                .Join
                (
                    _db.Groups,
                    ug => ug.GroupId,
                    g => g.Id,
                    (ug, g) => g
                );

            var groupArr = groups.Select(e => new GroupConnected() { Group = e }).ToArray();

            foreach (var group in groupArr)
            {
                GetQuizzes(group);
            }

            return Ok(groupArr);
        }

        private void GetQuizzes(GroupConnected group)
        {
            var quizzes = _db.Quizzes.Where(e => e.GroupId == group.Group.Id && e.Published);

            foreach (var quiz in quizzes)
            {
                group.Quizzes.Add(new QuizConnected() { Quiz = quiz });
            }
        }
    }
}
