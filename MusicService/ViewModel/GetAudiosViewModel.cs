using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HoloDB;
using IntellectualPlayer.Processing;

namespace MusicService.ViewModel
{
    public class GetAudiosViewModel : Audio
    {
        public SHA1HashDescriptor Sha1HashDescriptor { get; set; }
        
        public Envelope Envelope { get; set; }

        public VolumeDescriptor VolumeDescriptor { get; set; }

        public Tempogram Tempogram { get; set; }
    }
}