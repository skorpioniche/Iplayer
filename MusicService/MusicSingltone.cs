using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using IntellectualPlayer.Core;
using IntellectualPlayer.UI;
using HoloDB;
using NLog;

namespace MusicService
{
    public static class MusicSingltone
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private static PlayerCore core;

        public static string MusicFolder { get; set; }

        public static PlayerCore Core
        {
            get
            {
                if (core == null)
                {
                    InicializationCore();
                }
                return core;
            }
        }

        public static void InicializationCore()
        {
            var factory = new DefaultFactory();
            core = new PlayerCore(factory);
            core.SaveDatabase();
            Scaning();
            StartCalculeteProcessor();
        }

        public static void SaveChanges()
        {
            core.SaveDatabase();
        }

        public static void Scaning(string folderPath="")
        {
            if (string.IsNullOrEmpty(folderPath))
            {
                folderPath = MusicFolder;             
            }
            MusicSingltone.Core.ScanInBackground(new string[] { folderPath });
        }


        private static void StartCalculeteProcessor()
        {
            var worker = new Thread(() => Calculete())
            {
                IsBackground = true
            };
            worker.Start();
        }

        private static object Calculete()
        {
            while (true)
            {
                try
                {
                    MusicSingltone.Core.ProcessAudios();
                    SaveChanges();
                }
                catch (Exception e)
                {
                    Logger.Error("Ошибка при анализе аудио:" + e.Message); 
                }
               Thread.Sleep(10000);
            }         
        }

        
    }
}