namespace DSJTournaments.Api.Controllers.Results.ResponseModels
{
    public class ResultResponseModel
    {
        public int Rank { get; set; }
        public int JumperId { get; set; }
        public string Name { get; set; }
        public string Nation { get; set; }
        public int Participations { get; set; }
        public int TotalTournaments { get; set; }
        public int FirstPlaces { get; set; }
        public int SecondPlaces  { get; set; }
        public int ThirdPlaces  { get; set; }
        public int Top10  { get; set; }
        public int Top30  { get; set; }
        public int I { get; set; }
        public int II { get; set; }
        public int III { get; set; }
        public int CompletedHills { get; set; }
        public int TotalHills { get; set; }
        public int JumpPoints { get; set; }
        public int CupPoints { get; set; }
    }
}