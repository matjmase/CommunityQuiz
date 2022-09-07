using CommunityQuiz.Controllers.BaseClasses;
using CommunityQuiz.Db;
using CommunityQuiz.Models.Connected;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers.Details
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionDetailsController : BaseQuestionController
    {
        public QuestionDetailsController(CommunityQuizContext db) : base(db)
        {
        }

        [HttpGet("all/{id:int}")]
        public IActionResult GetAllQuestionsDetails(int quizId)
        {
            var questions = GetUserQuestions(HttpContext, quizId).Select(e => new QuestionConnected() { Question = e });

            foreach (var question in questions)
            {
                GetAllAnwers(question);
            }

            return Ok(questions.ToArray());
        }

        [HttpGet("{id:int}")]
        public IActionResult GetQuestionDetails(int id)
        {
            var question = new QuestionConnected() { Question = GetUserAllQuestions(HttpContext).First(e => e.Id == id) };
            GetAllAnwers(question);

            return Ok(question);
        }

        [HttpPut]
        public async Task<IActionResult> PutQuestionDetails([FromBody] QuestionConnected quest)
        {
            if (!IsValid(quest))
                return BadRequest("Question is not valid given answers.");

            var currentQuestions = _db.Questions.Where(e => e.Id == quest.Question.Id).
                Join(
                    _db.Answers,
                    q => q.Id,
                    a => a.QuestionId,
                    (q, a) => a
                ).Select(e => e.Id).ToHashSet();

            var newQuestions = quest.Answers.Select(e => e.Answer.Id).ToHashSet();

            var toRemove = currentQuestions.Except(newQuestions);

            _db.Answers.RemoveRange(toRemove.Select(e => _db.Answers.First(db => e == db.Id)));


            foreach (var answer in quest.Answers)
                answer.Answer.QuestionId = quest.Question.Id;

            foreach (var answer in quest.Answers)
            {
                if (answer.Answer.Id == 0)
                    await _db.Answers.AddAsync(answer.Answer);
                else
                    _db.Answers.Update(answer.Answer);
            }

            _db.Questions.Update(quest.Question);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> PostQuestionDetails([FromBody] QuestionConnected quest)
        {
            if (!IsValid(quest))
                return BadRequest("Question is not valid given answers.");

            var dbQuiz = GetUserQuizzes(HttpContext).FirstOrDefault(e => e.Id == quest.Question.Id);

            if (dbQuiz != null)
                return BadRequest();


            var dbItem = await _db.Questions.AddAsync(quest.Question);
            await _db.SaveChangesAsync();

            foreach (var answer in quest.Answers)
                answer.Answer.QuestionId = dbItem.Entity.Id;

            await _db.Answers.AddRangeAsync(quest.Answers.Select(e => e.Answer));
            await _db.SaveChangesAsync();


            return Ok(dbItem.Entity.Id);
        }

        private void GetAllAnwers(QuestionConnected question)
        {
            var answers = _db.Answers.Where(e => e.QuestionId == question.Question.Id);

            foreach (var answer in answers)
            {
                question.Answers.Add(new AnswerConnected() { Answer = answer });
            }
        }

        private bool IsValid(QuestionConnected question)
        {
            var count = 0;

            foreach (var answer in question.Answers)
            {
                if (answer.Answer.Correct)
                    count++;
            }

            return (!question.Question.MultiAnswer && count == 1) || (question.Question.MultiAnswer && count >= 1);
        }
    }
}
