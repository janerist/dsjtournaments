using System;

namespace DSJTournaments.Api.Controllers.Jumpers.ResponseModels
{
    public class JumperResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Nation { get; set; }
        public string GravatarHash { get; set; }
        public int Participations { get; set; }
        public DateTime? LastActive { get; set; }
    }
}