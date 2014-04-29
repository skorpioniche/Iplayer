using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using HoloDB;
using NLog;

namespace IntellectualPlayer.Core
{
    /// <summary>
    /// Decodes audio sources, calculates chracteristics of signal.
    /// Results of processing are storing in Audio items.
    /// </summary>
    public class AudioProcessor : IAudioProcessor
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private  Factory factory;
        private Queue<Audio> audioSourceQueue = new Queue<Audio>();
        private int itemsCount;

        /// <summary>
        /// Requested bitrate of signal after decoding
        /// </summary>
        public float TargetBitrate { get; set; }
        /// <summary>
        /// Progress of processing event
        /// </summary>
        public event EventHandler<ProgressChangedEventArgs> Progress;

        public AudioProcessor(Factory factory)
        {
            this.factory = factory;
            TargetBitrate = 24000;//8000
        }

        /// <summary>
        /// AudioAnalys audioList of Audio items
        /// </summary>
        /// <param name="audioList"></param>
        public virtual void AudioAnalys(IList<Audio> audioList)
        {
            if (audioList.Count == 0)
            {
                return;
            }

            lock (audioSourceQueue)
            {
                foreach (var item in audioList)
                {
                    audioSourceQueue.Enqueue(item);
                }
            }

            itemsCount += audioList.Count;

            using (var decoder = factory.CreateAudioDecoder())
            {
                if (decoder.AllowsMultithreading)
                {
                    ProcessMultithreading(decoder);
                }
                else
                {
                    AudioAnalys(decoder);
                }
            }

            OnProgress(new ProgressChangedEventArgs(100, null));
        }

        protected virtual void OnProgress(ProgressChangedEventArgs e)
        {
            if (Progress != null)
                try
                {
                    Progress(this, e);
                }
                catch (Exception E)
                {
                    Logger.InfoException("OnProgress handler exception.", E);
                }
        }

        protected virtual void ProcessMultithreading(IAudioDecoder decoder)
        {
            var threads = new List<Thread>();
            //create threads
            var threadCount = Environment.ProcessorCount;
            for (int i = 0; i < threadCount; i++)
            {
                var t = new Thread(() => AudioAnalys(decoder)) { IsBackground = true };
                t.Start();
                threads.Add(t);
            }

            while (audioSourceQueue.Count > 0)
            {
                Thread.Sleep(100);
            }

            foreach (var t in threads)
            {
                t.Join();
            }
        }

        /// <summary>
        /// Gets audio from queue and process it
        /// </summary>
        protected virtual void AudioAnalys(IAudioDecoder decoder)
        {
            int counter = 0;
            Audio item;
            while ((item = GetItemFromQueue()) != null)
                try
                {
                    counter++;
                    //decode audio source to samples and mp3 tags extracting
                    AudioInfo info = null;
                    using (var stream = item.GetSourceStream())
                        info = decoder.Decode(stream, TargetBitrate, item.GetSourceExtension());

                    //normalize volume level
                    info.Samples.Normalize();

                    //launch sample processors
                    foreach (var processor in factory.CreateSampleProcessors())
                        try
                        {
                            processor.Process(item, info);
                        }
                        catch (Exception E)
                        {
                            Logger.WarnException("Audio processor exception.", E);
                        }

                    OnProgress(new ProgressChangedEventArgs(100 * (itemsCount - audioSourceQueue.Count) / itemsCount, null));
                    item.State = AudioState.Processed;
                }
                catch (Exception E)
                {
                    Logger.ErrorException("Audio processing failed.", E);

                    item.State = AudioState.Bad;
                }
        }

        protected virtual Audio GetItemFromQueue()
        {
            lock (audioSourceQueue)
            {
                if (audioSourceQueue.Count > 0)
                    return audioSourceQueue.Dequeue();
            }

            return null;
        }
    }
}
