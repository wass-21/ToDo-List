using Microsoft.EntityFrameworkCore;

namespace Testt_IDO
{
    
    public class ToDo
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Category { get; set; }
        public string? DueDate { get; set; }
        public double EstimateValue { get; set; }
        public string? EstimateUnit { get; set; }
        public string? Importance { get; set; }
        public string? Status { get; set; }
        public int UserId { get; set; }
    }
}
