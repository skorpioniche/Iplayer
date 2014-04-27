using System.Linq;
using System.Collections.Generic;
using System.Web.Mvc;
using IntellectualPlayer.Core;
using MusicService.Models;
using MvcFileUploader;
using MvcFileUploader.Models;

namespace MusicService.Controllers
{
    public class MvcUploaderTestController : Controller
    {
        private readonly PlayerCore Core;

        public ActionResult Demo()
        {
            return View();
        }
        private UsersContext db = new UsersContext();

        public ActionResult UploadFile(int? entityId) // optionally receive values specified with Html helper
        {
            // here we can send in some extra info to be included with the delete url 
            var statuses = (List<ViewDataUploadFileResult>)TempData["statuses"];
            if (statuses==null)
                 statuses=new List<ViewDataUploadFileResult>();
            for (var i = 0; i < Request.Files.Count; i++ )
            {
                var st = FileSaver.StoreFile(x =>
                                                 {
                                                     x.File = Request.Files[i];
                                                     //note how we are adding an additional value to be posted with delete request
                                                     //and giving it the same value posted with upload
                                                     x.DeleteUrl = Url.Action("DeleteFile", new { entityId = entityId });
                                                     x.StorageDirectory = Server.MapPath("~/Content/uploads");
                                                     x.UrlPrefix = "/Content/uploads";

                                                 });
                CreateTrack(st.name, st.url); 
                statuses.Add(st);
            }             

            //statuses contains all the uploaded files details (if error occurs the check error property is not null or empty)
            //todo: add additional code to generate thumbnail for videos, associate files with entities etc
            
            //adding thumbnail url for jquery file upload javascript plugin
            //statuses.ForEach(x=>x.thumbnail_url=x.url+"?width=80&height=80"); // uses ImageResizer httpmodule to resize images from this url
            TempData["statuses"] = statuses;

            return Json(statuses);
        }

        public Track CreateTrack(string name, string fileUrl)
        {
            Track track = new Track(name, fileUrl);
            db.Tracks.Add(track);
            db.SaveChanges();
            return track;
        }

        public Track FindTrackByUrl(string fileUrl)
        {
            return db.Tracks.ToList().Find(x => x.FileName == fileUrl);
        }

        //here i am receving the extra info injected
        public ActionResult DeleteFile(int? entityId, string fileUrl)
        {
            Track track = FindTrackByUrl(fileUrl);
            if (track != null)
            {
                db.Tracks.Remove(track);
                db.SaveChanges();
            }
            var filePath = Server.MapPath("~" + fileUrl);

            if(System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            return new HttpStatusCodeResult(200); // trigger success
        }

    }
}
