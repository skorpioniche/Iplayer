using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MusicService.Models;


namespace MusicService.Controllers
{
    public class MusicController : Controller
    {
        private UsersContext db = new UsersContext();

        //
        // GET: /Music/

        public ActionResult Index()
        {
            return View(db.Tracks.ToList());
        }

        //
        // GET: /Music/Details/5

        public ActionResult Details(int id = 0)
        {
            Track track = db.Tracks.Find(id);
            if (track == null)
            {
                return HttpNotFound();
            }
            return View(track);
        }



        //
        // GET: /Music/Edit/5

        public ActionResult Edit(int id = 0)
        {
            Track track = db.Tracks.Find(id);
            if (track == null)
            {
                return HttpNotFound();
            }
            return View(track);
        }

        //
        // POST: /Music/Edit/5

        [HttpPost]
        public ActionResult Edit(Track track)
        {
            if (ModelState.IsValid)
            {
                db.Entry(track).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(track);
        }

        //
        // GET: /Music/Delete/5

        public ActionResult Delete(int id = 0)
        {
            Track track = db.Tracks.Find(id);
            if (track == null)
            {
                return HttpNotFound();
            }
            return View(track);
        }

        //
        // POST: /Music/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Track track = db.Tracks.Find(id);
            var filePath = Server.MapPath(track.FileName);
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);
            db.Tracks.Remove(track);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}