using CommunityQuiz.Db;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserGroupController : ControllerBase
    {
        private CommunityQuizContext _db;

        public UserGroupController(CommunityQuizContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> PostUserGroup([FromBody] UserGroup userGroup)
        {
            await _db.UserGroups.AddAsync(userGroup);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUserGroup([FromBody] UserGroup userGroup)
        {
            _db.UserGroups.Remove(userGroup);

            await _db.SaveChangesAsync();

            return Ok();
        }

    }
}
