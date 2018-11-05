using LiquidHub.Api.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace LiquidHubAPI.Controllers
{
    [EnableCors(origins: "http://localhost:63302", headers: "*", methods: "*")]
    public class EmployeeController : ApiController
    {
        [HttpGet]
        [Route("api/Employee/GetEmployee")]
        public IHttpActionResult GetEmployee()
        {
            // var emp = new EmployeeVM();
            // var empList = new List<EmployeeVM>();
            var empList = new Object();

            using (StreamReader r = new StreamReader("F:/Corporate Training/LiquidHub/LiquidHub/LiquidHub.Web/app/demodata.json"))
            {
                 var json = r.ReadToEnd();
                 empList = JsonConvert.DeserializeObject<Object>(json);
                 
            }

             return Ok(new { data = empList }); 
        }
    }
}
