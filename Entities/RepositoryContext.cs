﻿using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Entities
{
    public class RepositoryContext: DbContext
    {
        public RepositoryContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<Congregation> Congregations { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Participation> Participations { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Eligibility> Eligibilities { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Article> Articles { get; set; }
    }
}
