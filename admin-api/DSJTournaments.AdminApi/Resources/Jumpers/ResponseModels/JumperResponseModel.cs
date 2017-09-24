using System;

namespace DSJTournaments.AdminApi.Resources.Jumpers.ResponseModels
{
    public class JumperResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Nation { get; set; }
        public string GravatarEmail { get; set; }
        public string GravatarHash { get; set; }
        public int Participations { get; set; }
        public DateTime? LastActive { get; set; }
    }
}