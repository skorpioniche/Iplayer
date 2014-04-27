using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;


namespace MusicService.Models
{
    [Table("Post")]
    public class Post
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int PostId { get; set; }
        public string Message { get; set; }
        public int Views { get; set; }
        public virtual UserProfile User { get; set; }
        public virtual List<Track> Tracks { get; set; }
        public virtual List<Like> Likes { get; set; }

        public Post() 
        {
            Tracks = new List<Track>();
        }
    }

    [Table("Likes")]
    public class Like 
    {
        [Key, ForeignKey("User"), Column(Order = 0)]
        public int UserId { get; set; }
        [Key, ForeignKey("Post"), Column(Order = 1)]
        public int PostId { get; set; }
        public virtual Post Post { get; set; }
        public virtual UserProfile User { get; set; }
    }
}