using System.ComponentModel.DataAnnotations;

namespace DSJTournaments.Api.Controllers.Logs.RequestModels
{
    public class LogRequestModel
    {
        [Required]
        public string ClientId { get; set; }
        [Required]
        public string Path { get; set; }
        [Required]
        public string Message { get; set; }
        
        public string StackTrace { get; set; }
    }
}