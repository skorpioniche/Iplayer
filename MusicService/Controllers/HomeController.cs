using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IntellectualPlayer.Core;
using IntellectualPlayer.Processing.Search;
using IntellectualPlayer.UI;
using HoloDB;
using MusicService.Models;
using MvcFileUploader;
using MvcFileUploader.Models;

namespace MusicService.Controllers
{
    public class HomeController : Controller
    {

        private UsersContext db = new UsersContext();

        private Audios shownItems;
        private Audios ShownItems
        {
            get
            {
                if (shownItems == null)
                {
                    shownItems = new Audios(MusicSingltone.Core.GetAudios());//temp !!!!!
                }
                return shownItems;
            }

            set { shownItems = value; }
        }

        public ActionResult Index()
        {
            List<Track> trackList = new List<Track>();
            if (db.Tracks.Any())
            {
                trackList = db.Tracks.ToList();
            }
            return View(trackList);
        }

        public ActionResult Scan()
        {
            MusicSingltone.Core.ScanInBackground(new string[] { Server.MapPath("~/Content/uploads") });
            return View();
        }

        public ActionResult GetAudios()
        {
            MusicSingltone.Core.ProcessAudios();
            ShownItems = new Audios(MusicSingltone.Core.GetAudios());//temp !!!!!
            MusicSingltone.SaveChanges();
            return View(ShownItems);
        }


        public ActionResult Search(int id)
        {
            if (id < 0 || id >= ShownItems.Count)
            {
                return View(ShownItems);
            }

            SimilarityOptions Options = new SimilarityOptions()
            {
                AmpEnvelope = true,
                Intensity = true,
                LongRhythm = true,
                ShortRhythm = true,
                VolumeDistr = true
            };

            var searchItems = ShownItems.SearchBy<SearchBySimilarity>(id, Options);
            return View(searchItems);

        }

        [Authorize(Roles = "Admin")]
        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        [Authorize]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }



        public void CreateTrack(string name, string fileUrl)
        {
            Track track = new Track(name, fileUrl);
            db.Tracks.Add(track);
            db.SaveChanges();
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
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);
            return new HttpStatusCodeResult(200); // trigger success
        }
    }
}
