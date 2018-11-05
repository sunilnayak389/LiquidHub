using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiquidHub.Api.Models
{
    public class EmployeeVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public string Salary { get; set; }
        public string StartDate { get; set; }
        public string Office { get; set; }
        public string Extn { get; set; }
    }
}