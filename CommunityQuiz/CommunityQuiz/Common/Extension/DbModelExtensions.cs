using CommunityQuiz.Common.Role;
using CommunityQuiz.Db;
using CommunityQuiz.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CommunityQuiz.Common.Extension
{
    public static class DbModelExtensions
    {
        public static ClientUser ToClientUser(this User dbUser)
        {
            return new ClientUser() { Id = dbUser.Id, UserName = dbUser.UserName };
        }

        public static LoginResponse ToLoginResponse(User user, IEnumerable<CommunityQuiz.Db.Role> roles, IConfiguration config)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);



            var claims = new List<Claim>()
            {
                new Claim("Id", user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, Enum.GetName(typeof(AuthenticationRole), role.RoleId) ?? ""));
            }

            var expires = DateTime.Now.AddDays(1);

            var token = new JwtSecurityToken(config["Jwt:Issuer"],
              config["Jwt:Audience"],
              claims,
              expires: expires,
              signingCredentials: credentials);

            return new LoginResponse()
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                Roles = roles.Select(e => Enum.GetName(typeof(AuthenticationRole), e.RoleId)).ToArray(),
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ValidUntil = expires
            };
        }

        public static User GetCurrentUser(HttpContext context)
        {
            var identity = context.User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                var userClaims = identity.Claims;

                return new User
                {
                    Id = int.Parse(userClaims.First(o => o.Type == "Id").Value),
                    UserName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
                    Email = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
                };
            }
            return null;
        }

    }
}
