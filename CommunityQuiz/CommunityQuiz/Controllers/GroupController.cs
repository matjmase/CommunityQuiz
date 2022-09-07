using CommunityQuiz.Common.Extension;
using CommunityQuiz.Db;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private CommunityQuizContext _db;

        public GroupController(CommunityQuizContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public IActionResult GetAllGroups()
        {
            return Ok(_db.Groups.ToArray());
        }

        [HttpGet("mygroups")]
        [Authorize(Roles = "Administrator, Tester, User")]
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

            return Ok(groups.ToArray());
        }

        [HttpGet("{id:int}")]
        [Authorize(Roles = "Administrator")]
        public IActionResult GetGroup(int id)
        {
            return Ok(_db.Groups.First(g => g.Id == id));
        }

        [HttpPut]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PutGroup([FromBody] Group group)
        {
            _db.Groups.Update(group);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PostGroup([FromBody] Group group)
        {
            var dbItem = await _db.AddAsync(group);
            await _db.SaveChangesAsync();

            return Ok(dbItem.Entity.Id);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var dbGroup = _db.Groups.First(g => g.Id == id);
            _db.Remove(dbGroup);
            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}
