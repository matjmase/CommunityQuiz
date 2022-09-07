using CommunityQuiz.Common.Extension;
using CommunityQuiz.Db;
using CommunityQuiz.Models;
using CommunityQuiz.Models.Connected;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers.Result
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizResultOverviewController : ControllerBase
    {
        private CommunityQuizContext _db;

        public QuizResultOverviewController(CommunityQuizContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult GetMyResultsOverview()
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            var myApplicableQuizzes = _db.Users.Where(e => e.Id == user.Id)
                .Join(
                    _db.UserGroups,
                    u => u.Id,
                    ug => ug.UserId,
                    (u, ug) => ug
                )
                .Join(
                    _db.Groups,
                    ug => ug.GroupId,
                    g => g.Id,
                    (ug, g) => g
                )
                .Join(
                    _db.Quizzes,
                    g => g.Id,
                    q => q.GroupId,
                    (g, q) => q
                ).Select(e => new QuizConnected() { Quiz = e }).ToArray();

            foreach (var overview in myApplicableQuizzes)
            {
                var quizEvents = _db.UserQuizEvents.Where(e => e.QuizId == overview.Quiz.Id && e.UserId == user.Id).ToArray();

                foreach (var quizEvent in quizEvents)
                {
                    overview.QuizzEvents.Add(new UserQuizEventConnected() { QuizzEvent = quizEvent });
                }
            }

            return Ok(myApplicableQuizzes.ToArray());
        }

        [HttpGet("mystudents")]
        public IActionResult GetMyStudentsResultsOverview()
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            var quizzes = _db.Users.Where(e => e.Id == user.Id)
                .Join(
                    _db.UserGroups,
                    u => u.Id,
                    ug => ug.UserId,
                    (u, ug) => ug
                )
                .Join(
                    _db.Groups,
                    ug => ug.GroupId,
                    g => g.Id,
                    (ug, g) => g
                )
                .Join(
                    _db.Quizzes,
                    g => g.Id,
                    q => q.GroupId,
                    (g, q) => q
                ).Select(e => new QuizUserResultsOverview() { Quiz = e}).ToArray();

            foreach(var quizz in quizzes)
            {
                var quizEvents = _db.UserQuizEvents.Where(e => e.QuizId == quizz.Quiz.Id).ToArray();

                var unique = new Dictionary<int, HashSet<UserQuizEvent>>();

                foreach(var ev in quizEvents)
                {
                    if(!unique.ContainsKey(ev.UserId))
                    {
                        unique.Add(ev.UserId, new HashSet<UserQuizEvent>());
                    }
                    unique[ev.UserId].Add(ev);
                }

                foreach(var kv in unique)
                {
                    quizz.Users.Add(new UserWithUserQuizEvent() { User = _db.Users.First(e => e.Id == kv.Key).ToClientUser(), QuizEvents = kv.Value });
                }
            }

            return Ok(quizzes);
        }
    }
}
