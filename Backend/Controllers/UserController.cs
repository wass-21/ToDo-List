using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Testt_IDO.DATA;

namespace Testt_IDO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowOrigin")]
    public class UserController : ControllerBase
    {
        private IConfiguration _configuration;
        private readonly MyDbContext _dbContext;

        public UserController(IConfiguration configuration, MyDbContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDTO req)
        {
            var user = new User
            {
                Email = req.Email
            };
            CreatePasswordHash(req.Password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPost("signin")]
        public async Task<ActionResult<object>> Signin(UserDTO req)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null)
            {
                return BadRequest(new { Message = "Invalid Email", ErrorType = "email" });
            }
            if (user.Email != req.Email)
            {
                return BadRequest(new { Message = "Invalid Email", ErrorType = "email" });
            }

            if (!VerifyPasswordHash(req.Password, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest(new { Message = "Incorrect Password", ErrorType = "password" });
            }

            

            var response = new
            {
                User = user,
                

            };

            return Ok(response);
        }

       

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }
    }
}
