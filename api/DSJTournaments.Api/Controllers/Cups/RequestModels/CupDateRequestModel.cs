using System.ComponentModel.DataAnnotations;

namespace DSJTournaments.Api.Controllers.Cups.RequestModels
{
    public class CupDateRequestModel
    {
        public int? Id { get; set; }

        [Required]
        [RegularExpression(@"\d{4}-\d{2}-\d{2}")]
        public string Date { get; set; }

        [Required]
        [RegularExpression(@"\d{2}:\d{2}")]
        public string Time { get; set; }

        public int? TypeId { get; set; }

        public bool Destroy { get; set; }
    }
}