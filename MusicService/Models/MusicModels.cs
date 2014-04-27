using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;

namespace MusicService.Models
{
    [Table("Track")]
    public class Track
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int TrackId { get; set; }
        public string Name { get; set; }
        public string Album { get; set; }
        public string Artist { get; set; }
        public string FileName { get; set; }
        public virtual Post Post { get; set; }

        public Track() { }

        public Track(string name, string album, string artist, string fileUrl)
        {
            Name = name;
            Album = album;
            Artist = artist;
            FileName = fileUrl;
        }

        public Track(string name, string fileUrl)
        {
            Name = name;
            Album = "Unknown";
            Artist = "Unknown";
            FileName = fileUrl;      
        }
    }    
}