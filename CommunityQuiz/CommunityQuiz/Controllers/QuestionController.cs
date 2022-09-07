using CommunityQuiz.Controllers.BaseClasses;
using CommunityQuiz.Db;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuestionController : BaseQuestionController
    {

        public QuestionController(CommunityQuizContext db) : base(db)
        {
        }

        [HttpGet("all/{quizId:int}")]
        public IActionResult GetAllQuestions(int quizId)
        {
            return Ok(GetUserQuestions(HttpContext, quizId).ToArray());
        }

        [HttpGet("{id:int}")]
        public IActionResult GetQuestion(int id)
        {
            return Ok(GetUserAllQuestions(HttpContext).First(e => e.Id == id));
        }

        [HttpPut]
        public async Task<IActionResult> PutQuestion([FromBody] Question quest)
        {
            var dbQuest = GetUserAllQuestions(HttpContext).FirstOrDefault(e => e.Id == quest.Id);

            if (dbQuest == null)
                return BadRequest("Question does not belong to a quiz that belongs to a group that the user is a part of.");

            _db.Update(quest);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> PostQuestion([FromBody] Question quest)
        {
            var dbQuiz = GetUserQuizzes(HttpContext).FirstOrDefault(e => e.Id == quest.Id);

            if (dbQuiz == null)
                return BadRequest("The user is not a member of the question's quiz's group.");

            var dbItem = await _db.Questions.AddAsync(quest);
            await _db.SaveChangesAsync();

            return Ok(dbItem.Entity.Id);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var dbQuest = GetUserAllQuestions(HttpContext).FirstOrDefault(e => e.Id == id);

            if (dbQuest == null)
                return BadRequest("The user is not a member of the question's quiz's group.");

            _db.Remove(dbQuest);
            await _db.SaveChangesAsync();

            return Ok();
        }

    }
}
