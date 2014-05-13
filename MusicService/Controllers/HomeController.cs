using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IntellectualPlayer.Core;
using IntellectualPlayer.Processing;
using IntellectualPlayer.Processing.Search;
using IntellectualPlayer.UI;
using HoloDB;
using IntellectualPlayer.UI.Controls;
using Mp3Lib;
using MusicService.Models;
using MusicService.ViewModel;
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
            ShownItems = new Audios(MusicSingltone.Core.GetAudios());//temp !!!!!
            var audios = ShownItems.Select(shownItem => new GetAudiosViewModel()
            {
                Sha1HashDescriptor = (SHA1HashDescriptor)shownItem.Data[0],
                Envelope = (Envelope)shownItem.Data[1],
                VolumeDescriptor = (VolumeDescriptor)shownItem.Data[2],
                Tempogram = (Tempogram)shownItem.Data[3],
                FullPath = shownItem.FullPath,
                State = shownItem.State,
                Tag = shownItem.Tag
            }).ToList();

            return View(audios);
        }

        public ActionResult GetMeta()
        {
            ShownItems = new Audios(MusicSingltone.Core.GetAudios());

            var audio = ShownItems.Last();
            var mp3File = new Mp3File(audio.FullPath);

            return View(mp3File);
        }


        public ActionResult Search(int id)
        {
            var trackList = new List<Track>();
            if (db.Tracks.Any())
            {
                trackList = db.Tracks.ToList();
            }

            if (id < 0 || id >= ShownItems.Count)
            {
                return View(new List<Track>());
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
            var showTrackList = new List<Track>();
            foreach (var shownItem in searchItems)
            {
                var track = trackList.FirstOrDefault(t => t.FileName.Contains(shownItem.ShortName));
                if (track != null)
                {
                    showTrackList.Add(track);
                }
            }
            return View(showTrackList);

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
