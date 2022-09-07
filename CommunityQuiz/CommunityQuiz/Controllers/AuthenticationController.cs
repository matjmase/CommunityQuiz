using CommunityQuiz.Common.Authentication;
using CommunityQuiz.Common.Extension;
using CommunityQuiz.Common.Role;
using CommunityQuiz.Db;
using CommunityQuiz.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthenticationController : ControllerBase
    {
        private IConfiguration _config;
        private CommunityQuizContext _db;

        public AuthenticationController(CommunityQuizContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpGet("roles")]
        public IActionResult GetAllRoles()
        {
            return Ok(Enum.GetNames(typeof(AuthenticationRole)));
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginCredentials credentials)
        {
            var dbUser = _db.Users.FirstOrDefault(e => e.Email == credentials.Email);

            if (dbUser == null)
                return BadRequest("User with email does not exist");

            var dbPassword = _db.Passwords.First(e => e.UserId == dbUser.Id);

            var newHash = PasswordSecurity.HashPassword(credentials.Password, dbPassword.Salt);

            if (newHash != dbPassword.Hash)
                return BadRequest("Password is incorrect");

            var roles = _db.Roles.Where(e => e.UserId == dbUser.Id).ToArray();

            return Ok(DbModelExtensions.ToLoginResponse(dbUser, roles, _config));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterCredentials credentials)
        {
            var dbUser = _db.Users.FirstOrDefault(e => e.Email == credentials.Email);

            if (dbUser != null)
                return BadRequest("User with email already exists");


            var dbEntity = await _db.Users.AddAsync(credentials.ToDbUser());

            await _db.SaveChangesAsync();

            try
            {
                //Password
                var salt = PasswordSecurity.GetSalt();
                var newHash = PasswordSecurity.HashPassword(credentials.Password, salt);

                await _db.Passwords.AddAsync(new Password() { UserId = dbEntity.Entity.Id, Salt = salt, Hash = newHash });

                //Roles
                var roles = credentials.Roles.ToArray();
                var couldParse = true;
                AuthenticationRole[] credRoles = new AuthenticationRole[roles.Length];

                for (var i = 0; i < roles.Length; i++)
                {
                    var credRole = default(AuthenticationRole);
                    couldParse = couldParse && Enum.TryParse(roles[i], out credRole);
                    credRoles[i] = credRole;
                }

                if (!couldParse)
                    return BadRequest("Unidentified Role");

                var addRoles = new List<Role>();
                for (var i = 0; i < credRoles.Length; i++)
                {
                    addRoles.Add(new Role() { RoleId = (byte)credRoles[i], UserId = dbEntity.Entity.Id });
                }

                await _db.Roles.AddRangeAsync(addRoles);


                //final save
                await _db.SaveChangesAsync();

                return Ok(DbModelExtensions.ToLoginResponse(dbEntity.Entity, addRoles, _config));
            }
            catch (Exception e)
            {
                _db.Users.Remove(dbEntity.Entity);
                await _db.SaveChangesAsync();

                return BadRequest();
            }
        }
    }
}
