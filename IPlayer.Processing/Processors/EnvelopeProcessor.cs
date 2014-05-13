using System;
using IntellectualPlayer.Core;
using HoloDB;

namespace IntellectualPlayer.Processing
{
    /// <summary>
    /// Builds amplitude envelope
    /// </summary>
    public class EnvelopeProcessor : ISampleProcessor
    {
        private readonly Factory Factory;
        const int EnvelopeLength = 64;

        public EnvelopeProcessor(Factory factory)
        {
            Factory = factory;   
        }

        /// <summary>
        /// Amplitude envelope builder
        /// Save maximum values
        /// </summary>
        public Samples Build(Samples source, int newBitrate = 20, bool differentiate = false) 
        {
            float koeff = 1f * newBitrate /source.Bitrate;
            var values = source.Values;
            var resValues = new float[(int)(values.Length * koeff)+1];

            for (var i = values.Length - 2; i >= 0; i--)
            {
                var newIndex = (int) (i*koeff);
                var prevValue = resValues[newIndex];
                var value = values[i];
                if (differentiate)
                {
                    value = values[i + 1] - value;
                }
                value = Math.Abs(value);

                if (prevValue < value)
                {
                    resValues[newIndex] = value;
                }
            }

            return new Samples()
            {
                Bitrate = newBitrate, Values = resValues
            };
        }

        public virtual void Process(Audio item, AudioInfo info)
        {
            //build amplitude envelope
            var s = Build(info.Samples);
            //resample
            var resampler = Factory.CreateResampler();
            var resampled = resampler.Resample(s, info.Samples.Bitrate * ((float)EnvelopeLength / info.Samples.Values.Length));

            //build packed array
            var envelope = new Envelope(resampled);
            //save into audio item
            item.Data.Add(envelope);

            //build volumeDescriptor
            var volDesc = new VolumeDescriptor();
            volDesc.Build(s.Values);

            item.Data.Add(volDesc);
        }
    }
}
