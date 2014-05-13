using System;
using System.Collections.Generic;
using IntellectualPlayer.Core;
using HoloDB;

namespace IntellectualPlayer.Processing
{
    public class TempogramProcessor : ISampleProcessor
    {
        private const float maxRithmDuration = 6;//seconds
        private const float minAmplitudeChangeForIntensityRate = 0.2f;
        private Factory factory;

        public TempogramProcessor(Factory factory)
        {
            this.factory = factory;
        }

        public void Process(Audio item, AudioInfo info)
        {
            var tempogram = new Tempogram();
            //get maximum values
            Samples samples = new EnvelopeProcessor(factory).Build(info.Samples, 32, false);
            var newSamples = new Samples()
            {
                Values = new float[samples.Values.Length], Bitrate = samples.Bitrate
            };

            var intensity = 0; 

            for (int i = 0; i < samples.Values.Length - 1; i++)
            {
                var diff = samples.Values[i + 1] - samples.Values[i];
                samples.Values[i] = diff > 0 ? diff : 0; //разница между всеми амплитудами
                newSamples.Values[i] = diff;
                if (diff > minAmplitudeChangeForIntensityRate)
                {
                    intensity++;
                }
            }
            samples.Values[samples.Values.Length - 1] = 0;
            newSamples.Values[samples.Values.Length - 1] = 0;

            var durationOfTrack = samples.Values.Length / samples.Bitrate;//time of sound

            var maxShift = (int)(samples.Values.Length * (maxRithmDuration / durationOfTrack));

            var autoCorr1 = AutoCorr(samples.Values, maxShift, 5);
            var autoCorr2 = AutoCorr(newSamples.Values, maxShift, 2);
            var lengthCorr1 = (float)autoCorr1.Length;
            var log2 = Math.Log(2);
            var list1 = new List<KeyValuePair<float, float>>();
            var list2 = new List<KeyValuePair<float, float>>();
            for (int i = 0; i < lengthCorr1; i++)
            {
                var j = i / (float)lengthCorr1;
                j = (float)(Math.Log(j + 1) / log2);
                list1.Add(new KeyValuePair<float, float>(j, autoCorr1[i]));

                var v = autoCorr2[i];
                list2.Add(new KeyValuePair<float, float>(j, v > 0 ? v : 0));
            }
            tempogram.LongTempogram.Build(list1);
            tempogram.ShortTempogram.Build(list2);

            tempogram.Intensity = (float)intensity / durationOfTrack;

            CalcTempo(tempogram);

            //save to audio item
            item.Data.Add(tempogram);
        }

        public static void CalcTempo(Tempogram tempogram)
        {
            var step = 1f/tempogram.LongTempogram.Size;
            var hist = tempogram.LongTempogram;
            //find main frequency 
            var max = 0f;
            var best = 0f;
            for(float i=0;i<=1;i+=step)
            {
                var v = hist[i] * (1 - 0.8f * i);
                if(v > max)
                {
                    max = v;
                    best = i;
                }
            }

            var k = Math.Log(2);
            //j = (float)(Math.Log(j + 1) / k);
            best = (float)Math.Exp(best*k) - 1;

            tempogram.LongRhythm = 1/(best * maxRithmDuration);//hz
            tempogram.LongRhythmLevel = max;
        }

        protected virtual float[] AutoCorr(float[] values, int maxShift, int pow = 2)
        {
            float[] autoCorr = new float[maxShift - 1];

            for (int shift = 1; shift < maxShift; shift++)
            {
                var sum = 0f;
                var count = values.Length - (pow - 1)*shift;
                for (int i = 0; i < count; i++)
                {
                    var value = values[i];

                    for (int p = 1; p < pow; p++)
                    {
                        value *= values[i + p * shift];
                    }

                    sum += value;
                }
                autoCorr[shift - 1] = sum;
            }
            return autoCorr;
        }
    }
}
