using CommunityQuiz.Common.Extension;
using CommunityQuiz.Db;
using CommunityQuiz.Models.Connected;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers.Take
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizTakeController : ControllerBase
    {
        private CommunityQuizContext _db;

        public QuizTakeController(CommunityQuizContext db)
        {
            _db = db;
        }

        [HttpGet("{id:int}")]
        public IActionResult GetQuizTake(int id)
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            var quiz = _db.Users.Where(e => e.Id == user.Id)
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
                ).FirstOrDefault(e => e.Id == id && e.Published);

            if (quiz == null)
                return BadRequest("You are not applicable for the quiz or it is not published");

            var take = new QuizConnected() { Quiz = quiz };  

            FillInQuestions(take);

            return Ok(take);
        }

        [HttpPost]
        public async Task<IActionResult> PostResults([FromBody] UserQuizEventConnected results)
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            if (results.QuizzEvent.UserId != user.Id)
                return BadRequest();

            var dbQuiz = _db.Users.Where(e => e.Id == user.Id)
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
                ).FirstOrDefault(e => e.Id == results.QuizzEvent.QuizId && e.Published);

            if (dbQuiz == null)
                return BadRequest();

            var dbAnswersIds = _db.Users.Where(e => e.Id == user.Id)
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
                ).Where(e => e.Id == results.QuizzEvent.QuizId && e.Published)
                .Join(
                    _db.Questions,
                    q => q.Id,
                    quest => quest.QuizId,
                    (q, quest) => quest
                )
                .Join(
                    _db.Answers,
                    q => q.Id,
                    a => a.QuestionId,
                    (q, a) => a
                ).Select(e => e.Id).ToArray();

            var intersect = dbAnswersIds.Intersect(results.AnswersEvents.Select(e => e.AnswerEvent.AnswerId));

            if (intersect.Count() != dbAnswersIds.Count())
                return BadRequest();

            results.QuizzEvent.Date = DateTime.Now;

            var dbItem = await _db.UserQuizEvents.AddAsync(results.QuizzEvent);
            await _db.SaveChangesAsync();

            foreach(var answer in results.AnswersEvents)
            {
                answer.AnswerEvent.UserQuizEventId = dbItem.Entity.Id;
            }

            await _db.AnswerEvents.AddRangeAsync(results.AnswersEvents.Select(e => e.AnswerEvent));
            await _db.SaveChangesAsync();

            return Ok(dbItem.Entity.Id);
        }

        private void FillInQuestions(QuizConnected quiz)
        {
            var questions = _db.Questions.Where(e => e.QuizId == quiz.Quiz.Id);

            foreach(var question in questions)
            {
                var questDetails = new QuestionConnected() { Question = question };

                quiz.Questions.Add(questDetails);
            }

            foreach(var question in quiz.Questions)
            {
                FillInAnswers(question);
            }
        }

        private void FillInAnswers(QuestionConnected question)
        {
            var answers = _db.Answers.Where(e => e.QuestionId == question.Question.Id);

            foreach(var answer in answers)
            {
                question.Answers.Add(new AnswerConnected() { Answer = answer });
            }
        }
    }
}
