using System;
using System.Collections.Generic;

namespace Entities.DataTransferObjects
{
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime LastUpdatedTime { get; set; }
        public IEnumerable<ParticipationDto> Participations { get; set; }
    }
}
