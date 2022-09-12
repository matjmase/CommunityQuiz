using CommunityQuiz.Common.Extension;
using CommunityQuiz.Db;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private CommunityQuizContext _db;

        public QuizController(CommunityQuizContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "Tester")]
        public IActionResult GetAllQuizes()
        {
            return Ok(GetUserQuizzes(HttpContext));
        }

        [HttpGet("group/{id:int}")]
        public IActionResult GetGroupQuizes(int id)
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            var isMember = _db.UserGroups.FirstOrDefault(e => e.UserId == user.Id && e.GroupId == id);

            if (isMember == null)
                return BadRequest("User is not a member of this group");

            var quizzes = _db.Quizzes.Where(e => e.GroupId == id).ToArray();

            return Ok(quizzes);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetQuiz(int id)
        {
            return Ok(GetUserQuizzes(HttpContext).First(e => e.Id == id));
        }


        [HttpPut]
        [Authorize(Roles = "Tester")]
        public async Task<IActionResult> PutQuiz([FromBody] Quiz quiz)
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            var dbQuizzes = GetUserQuizzes(HttpContext);

            if (!dbQuizzes.Any(e => e.Id == quiz.Id))
                return BadRequest("Quiz Id not currently in the database");

            _db.Quizzes.Update(quiz);

            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Tester")]
        public async Task<IActionResult> PutPublishQuiz(int id)
        {
            var dbQuiz = GetUserQuizzes(HttpContext).First(e => e.Id == id);

            if (dbQuiz == null)
                return BadRequest("Quiz Id not currently in the database");

            dbQuiz.Published = true;

            _db.Quizzes.Update(dbQuiz);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        [Authorize(Roles = "Tester")]
        public async Task<IActionResult> PostQuiz([FromBody] Quiz quiz)
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            var userGroup = _db.UserGroups.FirstOrDefault(e => e.UserId == user.Id && e.GroupId == quiz.GroupId);

            if (userGroup == null)
                return BadRequest("User is not member of the group for the Quiz");

            var dbItem = await _db.AddAsync(quiz);
            await _db.SaveChangesAsync();

            return Ok(dbItem.Entity.Id);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Tester")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            var user = DbModelExtensions.GetCurrentUser(HttpContext);

            var dbQuiz = GetUserQuizzes(HttpContext).FirstOrDefault(e => e.Id == id);

            if (dbQuiz == null)
                return BadRequest("Quiz Id not found in database");

            _db.Remove(dbQuiz);
            await _db.SaveChangesAsync();

            return Ok();
        }

        private IQueryable<Quiz> GetUserQuizzes(HttpContext context)
        {
            var user = DbModelExtensions.GetCurrentUser(context);

            var quizzes = _db.Users.Where(e => e.Id == user.Id)
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
                )
                .Join
                (
                    _db.Quizzes,
                    g => g.Id,
                    q => q.GroupId,
                    (g, q) => q
                );

            return quizzes;
        }
    }
}
