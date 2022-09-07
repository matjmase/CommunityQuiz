using CommunityQuiz.Common.Extension;
using CommunityQuiz.Db;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private CommunityQuizContext _db;

        public UserController(CommunityQuizContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return Ok(_db.Users.Select(e => e.ToClientUser()).ToArray());
        }

        [HttpGet("{id:int}")]
        public IActionResult GetUser(int id)
        {
            return Ok(_db.Users.First(g => g.Id == id).ToClientUser());
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var dbUser = _db.Users.First(g => g.Id == id);
            _db.Users.Remove(dbUser);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("groupmember/{id:int}")]
        public IActionResult GetGroupMemberUsers(int id)
        {
            var members = GetGroupMembers(id).ToArray();

            return Ok(members);
        }


        [HttpGet("groupnonmember/{id:int}")]
        public IActionResult GetGroupNonMemberUsers(int id)
        {
            var members = GetGroupMembers(id);
            var nonmembers = _db.Users.Except(members).ToArray();

            return Ok(nonmembers);
        }

        private IQueryable<User> GetGroupMembers(int id)
        {
            var members = _db.Groups.Where(e => e.Id == id)
                .Join
                (
                    _db.UserGroups,
                    g => g.Id,
                    ug => ug.GroupId,
                    (g, ug) => ug
                )
                .Join
                (
                    _db.Users,
                    ug => ug.UserId,
                    u => u.Id,
                    (ug, u) => u
                );

            return members;
        }
    }
}
