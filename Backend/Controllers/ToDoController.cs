using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Testt_IDO.DATA;

namespace Testt_IDO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        private readonly MyDbContext _dbContext;

        public ToDoController( MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var todos = _dbContext.ToDos.ToList();
                if (todos.Count == 0)
                {
                    return NotFound("No ToDos");
                }
                return Ok(todos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{UserId}")]
        public IActionResult GetbyUserId(int UserId)
        {
            try
            {
                var ToDos = _dbContext.ToDos.Where(t => t.UserId == UserId).ToList();
                if (ToDos.Count == 0)
                {
                    return NotFound($"ToDo not Found with user id {UserId}");
                }

                return Ok(ToDos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public IActionResult Post([FromBody] ToDo model)
        {

            var user = _dbContext.Users.Find(model.UserId);
            if (user == null)
            {
                return NotFound($"User with Id {model.UserId} not found.");
            }
            
            _dbContext.ToDos.Add(model);
            _dbContext.SaveChanges();
                return Ok();
        }


        [HttpPut]
        public IActionResult Put(ToDo model)
        {
            if (model == null )
            {
                if (model == null)
                {
                    return BadRequest("To Do is invalid");
                }
                
            }
            try
            {
                var ToDo = _dbContext.ToDos.Find(model.Id);
                if (ToDo == null)
                {
                    return NotFound($"ToDo not found with id{model.Id}");
                }
                ToDo.Id = model.Id; 
                ToDo.Title = model.Title;
                ToDo.Category = model.Category;
                ToDo.DueDate = model.DueDate;
                ToDo.EstimateValue = model.EstimateValue;
                ToDo.EstimateUnit = model.EstimateUnit;
                ToDo.Importance = model.Importance;
                ToDo.Status = model.Status;
                ToDo.UserId = model.UserId;
                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
