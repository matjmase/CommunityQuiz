using CommunityQuiz.Common.Extension;
using CommunityQuiz.Db;
using CommunityQuiz.Models.Connected;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers.Result
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizResultController : ControllerBase
    {
        private CommunityQuizContext _db;

        public QuizResultController(CommunityQuizContext db)
        {
            _db = db;
        }

        [HttpGet("{id:int}")]
        public IActionResult GetMyQuizResults(int id)
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            return GetQuizResults(user.Id, id);
        }


        [HttpGet("{userId:int}/{eventId:int}")]
        public IActionResult GetMyStudentsQuizResults(int userId, int eventId)
        {

            return GetQuizResults(userId, eventId);
        }

        private IActionResult GetQuizResults(int userId, int eventId)
        {
            var dbQuizEvent = _db.UserQuizEvents.FirstOrDefault(e => e.UserId == userId && e.Id == eventId);

            if (dbQuizEvent == null)
                return BadRequest();

            var answersEvents = _db.AnswerEvents.Where(e => e.UserQuizEventId == eventId).ToArray();

            var questions = _db.UserQuizEvents.Where(e => e.UserId == userId && e.Id == dbQuizEvent.Id)
                .Join(
                    _db.Quizzes,
                    uq => uq.QuizId,
                    q => q.Id,
                    (uq, q) => q
                )
                .Join(
                    _db.Questions,
                    q => q.Id,
                    quest => quest.QuizId,
                    (q, quest) => quest
                    ).Select(e => new QuestionConnected() { Question = e }).ToArray();

            foreach (var question in questions)
            {
                foreach (var answer in _db.Answers.Where(e => e.QuestionId == question.Question.Id).ToArray())
                {
                    question.Answers.Add(new AnswerConnected() { Answer = answer, AnswerEvents = new HashSet<AnswerEventConnected>() { new AnswerEventConnected() { AnswerEvent = answersEvents.First(e => e.AnswerId == answer.Id) } } });
                }
            }

            return Ok(new QuizConnected() { Quiz = _db.Quizzes.First(e => e.Id == dbQuizEvent.QuizId), QuizzEvents = new HashSet<UserQuizEventConnected>() { new UserQuizEventConnected() { QuizzEvent = dbQuizEvent } }, Questions = questions });
        }
    }
}
