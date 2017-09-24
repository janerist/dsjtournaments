using System.ComponentModel.DataAnnotations;

namespace DSJTournaments.AdminApi.Resources.Jumpers.RequestModels
{
    public class JumperMergeRequestModel
    {
        [Required]
        [MinLength(1)]
        public int[] SourceJumperIds { get; set; }

        [Required]
        public int DestinationJumperId { get; set; }
    }
}