using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using IntellectualPlayer.Core.Helpers;
using HoloDB;
using NLog;

namespace IntellectualPlayer.Core
{
    public sealed class PlayerCore
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private readonly Factory Factory;
        private ViewProxy View;

        private DB Database;

        public PlayerCore(Factory factory)
        {
            if (factory == null)
            {
                throw new ArgumentNullException("factory");
            }

            View = new ViewProxy();
            Factory = factory;

            LoadDatabase();
        }

        public void SetView(IView view)
        {
            View = new ViewProxy(view);
        }

        public void ScanInBackground(IEnumerable<string> pathes)
        {
            Thread Worker = new Thread(() => Scan(pathes))
                                {
                                    IsBackground = true
                                };
            Worker.Start();
        }

        private void Scan(IEnumerable<string> paths)
        {
            try
            {
                int Counter = 0;
                View.UpdateAddedCountLabel(Counter);

                Dictionary<string, int> AudioIndexes;

                lock (Database.Audios)
                {
                    AudioIndexes = Database.Audios.GetIndexesByFullPath();
                }

                foreach (var Path in AudioFileScanner.Scan(paths))
                {
                    if (!AudioIndexes.ContainsKey(Path))
                    {
                        var Item = new Audio()
                                       {
                                           FullPath = Path
                                       };

                        lock (Database.Audios)
                        {
                            Database.Audios.Add(Item);
                        }
                        Database.IsChanged = true;
                        
                        Counter++;
                        
                        if (Counter % 7 == 0)
                        {
                            View.UpdateAddedCountLabel(Counter);
                        }
                    }
                }

                View.UpdateAddedCountLabel(Counter);

                View.DisplayItems();
            }
            catch (Exception E)
            {
                Logger.ErrorException("Scan error.", E);

                View.ShowError(E);
            }
        }

        public void RemoveItems(IEnumerable<Audio> items)
        {
            if (items == null)
            {
                throw new ArgumentNullException("items");
            }

            try
            {
                lock (Database.Audios)
                {
                    Database.Audios.RemoveRange(items);
                }

                Database.IsChanged = true;

                View.DisplayItems();
            }
            catch (Exception E)
            {
                Logger.ErrorException("RemoveItems failed.", E);

                View.ShowError(E);
            }
        }

        public void ProcessAudios(EventHandler<ProgressChangedEventArgs> progressCallback)
        {
            var UnprocessedItems = new List<Audio>();

            lock (Database.Audios)
            {
                foreach (var Item in Database.Audios)
                {
                    if (Item.State == AudioState.Unprocessed)
                    {
                        UnprocessedItems.Add(Item);
                    }
                }
            }

            var Processor = Factory.CreateAudioProcessor();

            Database.IsChanged = true;

            Processor.Progress += progressCallback;
            Processor.Process(UnprocessedItems);
        }

        public void ProcessAudios()
        {
            var unprocessedItems = new List<Audio>();

            lock (Database.Audios)
            {
                unprocessedItems.AddRange(Database.Audios.Where(item => item.State == AudioState.Unprocessed));
            }

            var processor = Factory.CreateAudioProcessor();

            Database.IsChanged = true;
            processor.Process(unprocessedItems);
        }

        public IEnumerable<Audio> GetAudios()
        {
            return Database.Audios;
        }

        #region Database functions

        public static string DatabasePath
        {
            get
            {
                // TODO: Move to configuration.
                return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Iplayer.db");
            }
        }

        private void LoadDatabase()
        {
            Database = DB.Load(DatabasePath, Factory.GetKnownTypes());
        }

        public void SaveDatabase()
        {
            if (Database.IsChanged)
            {
                Database.Save(DatabasePath);
            }
        }

        public void MarkDatabaseAsChanged()
        {
            Database.IsChanged = true;
        }

        #endregion
    }
}
