using CommunityQuiz.Common.Extension;
using CommunityQuiz.Db;
using Microsoft.AspNetCore.Mvc;

namespace CommunityQuiz.Controllers.BaseClasses
{
    public abstract class BaseQuestionController : ControllerBase
    {

        protected CommunityQuizContext _db;

        public BaseQuestionController(CommunityQuizContext db)
        {
            _db = db;
        }

        protected IQueryable<Quiz> GetUserQuizzes(HttpContext context)
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

        protected IQueryable<Question> GetUserQuestions(HttpContext context, int quizId)
        {
            var user = DbModelExtensions.GetCurrentUser(context);

            var questions = _db.Users.Where(e => e.Id == user.Id)
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
                )
                .Where(q => q.Id == quizId)
                .Join
                (
                    _db.Questions,
                    q => q.Id,
                    quest => quest.QuizId,
                    (q, quest) => quest
                );

            return questions;
        }

        protected IQueryable<Question> GetUserAllQuestions(HttpContext context)
        {
            var user = DbModelExtensions.GetCurrentUser(context);

            var questions = _db.Users.Where(e => e.Id == user.Id)
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
                )
                .Join
                (
                    _db.Questions,
                    q => q.Id,
                    quest => quest.QuizId,
                    (q, quest) => quest
                );

            return questions;
        }
    }
}
