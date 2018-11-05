using LiquidHub.Api.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LiquidHub.Api.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
        public List<EmployeeVM> GetEmployee()
        {
            var emp = new EmployeeVM();
            var empList = new List<EmployeeVM>();


            using (StreamReader r = new StreamReader("F:/Corporate Training/LiquidHub/LiquidHub/LiquidHub.Api/demodata.json"))
            {
                string json = r.ReadToEnd();
                empList = JsonConvert.DeserializeObject<List<EmployeeVM>>(json);
            }


            //for (int i = 0; i < 10; i++)
            //{
            //    emp.Id = (i + 1).ToString();
            //    emp.Name = "LiquidFub" + i;
            //    emp.Office = "Office" + i;
            //    empList.Add(emp);
            //}

           
            return empList;
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
